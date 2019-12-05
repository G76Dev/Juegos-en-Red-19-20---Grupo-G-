package es.JeR_Group_G.Singularity_21;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.Collection;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/players")
public class PlayersController {
	long[] playerLastGet = new long[3];
	Timer[] playerTimers = new Timer[3];
	BufferedWriter playerWritter = null;

	Map<Long, Player> players = new ConcurrentHashMap<>();
	static Map<String, String> users = new ConcurrentHashMap<>();
	
	String newChatMessages = "";
	int clearCounter = 0;
	long nextId = 0;
	
	@GetMapping
	public Collection<Player> players() {
		return players.values();
	}
	
	//Get para obtener los datos como string desde la URL
	@GetMapping("/data")
	public Collection<PlayerData> playerDataAll() {
	
	Collection<PlayerData> playerList = new ArrayList<PlayerData>();
	
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
			//System.out.println(entry.getKey() + "/" + entry.getValue());
			PlayerData pData = new PlayerData();
			pData.setPlayer_name(entry.getValue().getPlayer_name());
			pData.setCharacter_selection(entry.getValue().getCharacter_selection());
			pData.setPlayer_ready(entry.getValue().isPlayer_ready());
			pData.setId(entry.getValue().getId());
			playerList.add(pData);
		}
	
		return playerList;
	}
	
	//Get para pedir acceso al modo online con unas credenciales
	@GetMapping("/login/{name}/{password}")
	public int login(@PathVariable String name, @PathVariable String password) {
		
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
			System.out.println(entry.getValue().getPlayer_name());
			if(entry.getValue().getPlayer_name().equals(name)){
        		return 0;
        	}
		}
		
		if(users.get(name) != null) {
			byte[] decodedBytes = Base64.getDecoder().decode(users.get(name));
			String decodedPassword = new String(decodedBytes);
			
			if(decodedPassword.equals(password)){
        		return 2;
        	} else {
        		return 1;
        	}
		} else {
			String encodedPassword = Base64.getEncoder().encodeToString(password.getBytes());
			users.put(name, encodedPassword);
			try {
			playerWritter = new BufferedWriter(new FileWriter(new File("src/main/resources/users.txt"), true));
            playerWritter.write(name +":"+ encodedPassword + "\n");
            playerWritter.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			return 2;
		}
	
		//Return codes: 0 - Name Taken, 1 - Password Missmatch, 2 - Perfect
	}
	
	//Get que le pasa a todos los clientes la información pública del resto
	@GetMapping("/data/{id}")
		public Collection<PlayerData> playerData(@PathVariable long id) {
		
		Collection<PlayerData> playerList = new ArrayList<PlayerData>();
		
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
		    //System.out.println(entry.getKey() + "/" + entry.getValue());
		    PlayerData pData = new PlayerData();
			pData.setPlayer_name(entry.getValue().getPlayer_name());
			pData.setCharacter_selection(entry.getValue().getCharacter_selection());
			pData.setPlayer_ready(entry.getValue().isPlayer_ready());
			pData.setId(entry.getValue().getId());
			playerList.add(pData);
		}
		
		playerLastGet[(int)id] = Calendar.getInstance().getTime().getTime();
		
		
		return playerList;
	}
	
	//Get que devuelve el numero de jugadores conectados
	@GetMapping("/data/playercount")
	public int playerCount() {
		return players.size();
	}
	
	//Get que devuelve las nuevas cadenas de texto del chat
	@GetMapping("/chat")
	public String getNewChat() {
		
	/*ArrayList<String> temporaryCopy = new ArrayList<String>(newChatMessages);
	
	clearCounter++;
	System.out.print(clearCounter);
	if(clearCounter >= players.size()) {
		newChatMessages.clear();
		clearCounter = 0;
		System.out.print("reset");
	}*/
	return newChatMessages;
}

	//Post que añade un nuevo jugador al servidor
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer(@RequestBody Player player) {

		long id = nextId;
		String encodedPassword = Base64.getEncoder().encodeToString(player.getPlayer_password().getBytes());
		//System.out.println("NextId en el post: " + id);

		player.setId(id);
		player.setPlayer_password(encodedPassword);
		
		players.put(id, player);
		
		playerLastGet[(int)id] = Calendar.getInstance().getTime().getTime();
		
		playerTimers[(int)id] = new Timer();
		playerTimers[(int)id].scheduleAtFixedRate(new TimerTask() {

            @Override
            public void run() {
              compruebaJugador(id);
            }
        }, 1000,500);
		
		try {
            App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
            String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
            App.writer.write(connectTime + " - Player conected: " + player.getPlayer_name()
            + ", id: " + player.getId() + ", IP: " + player.getPlayer_ip() + "\n");
            App.writer.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
		
		String stToAdd = player.getPlayer_name() + " has connected.<br />";
		newChatMessages += stToAdd;
		
		nextId++;

		return player;
	}
	
	//Post que añade mensajes al chat
	@PostMapping("/chat")
	@ResponseStatus(HttpStatus.CREATED)
	public void addChatText(@RequestBody String strToAdd) {
		String stToAdd = strToAdd;
		stToAdd = stToAdd.replace("\"", "");
		newChatMessages += stToAdd;
	}

	//Put que actualiza la selección de personaje de un jugador
	@PutMapping("/data/{id}")
	public ResponseEntity<Player> actulizaPlayer(@PathVariable long id, @RequestBody int cs) {
		
		Player player = players.get((long)id);
		player.setId(id);
		player.setCharacter_selection(cs);
		players.remove((long)id);
		players.put((long)id, player);
		
		/*String stToAdd = "";
		switch(cs) {
		case -1:
			stToAdd = player.getPlayer_name() + " has deselected his role.<br />";
			break;
		case 0:
			stToAdd = player.getPlayer_name() + " has selected the Male Android.<br />";
			break;
		case 1:
			stToAdd = player.getPlayer_name() + " has selected the Female Android.<br />";
			break;
		case 2:
			stToAdd = player.getPlayer_name() + " has selected the Human Player.<br />";
			break;
		}
		newChatMessages += stToAdd;*/
		
		try {
            App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
            String selectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
            App.writer.write(selectTime + " - " + player.getPlayer_name() + " selected character " + cs + "\n");
            App.writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

		return new ResponseEntity<>(HttpStatus.OK);
	}

	/*@GetMapping("/{id}")
	public ResponseEntity<Player> getPlayer(@PathVariable long id) {

		Player savedPlayer = players.get(id);

		if (savedPlayer != null) {
			return new ResponseEntity<>(savedPlayer, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}*/

	//Delete que borra un jugador del servidor
	@DeleteMapping("/{id}")
	public ResponseEntity<Player> borraPlayer(@PathVariable long id) {

		Player deletedPlayer = players.get(id);
		
		if (deletedPlayer != null) {
			//System.out.println("Voy  borrar al id2: " + id);
			players.remove(id);
			if(id == 0) {
				if (nextId > 2) {
					Player player1 = players.get((long)1);
					player1.setId(0);
					players.remove((long)1);
					players.put((long)0, player1);
					playerLastGet[0] = Calendar.getInstance().getTime().getTime();
					
					Player player2 = players.get((long)2);
					player2.setId(1);
					players.remove((long)2);
					players.put((long)1, player2);
					playerLastGet[1] = Calendar.getInstance().getTime().getTime();
					playerTimers[2].cancel();
					
				} else if (nextId > 1) {
					Player player1 = players.get((long)1);
					player1.setId(0);
					players.remove((long)1);
					players.put((long)0, player1);
					playerLastGet[0] = Calendar.getInstance().getTime().getTime();
					playerTimers[1].cancel();
					
				} else {
					playerTimers[0].cancel();
				}
			} else if (id == 1) {
				if (nextId > 2) {
					Player player2 = players.get((long)2);
					player2.setId(1);
					players.remove((long)2);
					players.put((long)1, player2);
					playerLastGet[1] = Calendar.getInstance().getTime().getTime();
					playerTimers[2].cancel();
					
				} else {
					playerTimers[1].cancel();
				}
			}
			
			nextId--;
			
			try {
	            App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
	            String disconnectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
	            App.writer.write(disconnectTime + " - Player disconected: " + deletedPlayer.getPlayer_name()
	            + ", id: " + deletedPlayer.getId() + ", IP: " + deletedPlayer.getPlayer_ip() + "\n");
	            App.writer.close();
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
			
			String stToAdd = deletedPlayer.getPlayer_name() + " has disconnected.<br />";
			newChatMessages += stToAdd;
			
			return new ResponseEntity<>(deletedPlayer, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	//Método que comprueba si el jugador se ha desconectado
	public void compruebaJugador(long id) {
		long actualTime = Calendar.getInstance().getTime().getTime();
		//System.out.println("id: " + id + " | aT: " + actualTime + " | lG: " + playerLastGet[(int) id] + " | dif: " + (actualTime - playerLastGet[(int) id]));
			if (playerLastGet[(int) id] < (actualTime - 1000)) {
				//System.out.println("Timer que se ejecuta: " + id);
				borraPlayer(id);
			}
	}
}

