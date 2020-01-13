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
	//Array of longs to save the last GET petition from an user.
	long[] playerLastGet = new long[3];
	//Array of timers to compare if an user disconnected.
	Timer[] playerTimers = new Timer[3];
	
	//Writter for add users.
	BufferedWriter playerWritter = null;

	//Map to save the players on the server memory.
	Map<Long, Player> players = new ConcurrentHashMap<>();
	//Map to save ALL TIME users on the server memory.
	static Map<String, String> users = new ConcurrentHashMap<>();
	
	//String that stores the new chat messages.
	String newChatMessages = "";
	
	//Long nextId to set a new player id when enters the game.
	long nextId = 0;
	
	//Return ALL DATA from players.
	public Collection<Player> players() {
		return players.values();
	}
	
	//GET to obtain ALL DATA as a string from the URL (for debugging).
	@GetMapping("/data")
	public Collection<PlayerData> playerDataAll() {
	Collection<PlayerData> playerList = new ArrayList<PlayerData>();
	
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
			PlayerData pData = new PlayerData();
			pData.setPlayer_name(entry.getValue().getPlayer_name());
			pData.setCharacter_selection(entry.getValue().getCharacter_selection());
			pData.setPlayer_ready(entry.getValue().isPlayer_ready());
			pData.setId(entry.getValue().getId());
			playerList.add(pData);
		}
	
		return playerList;
	}
	
	//GET to request access to the online mode with name and user.
	@GetMapping("/login/{name}/{password}")
	public int login(@PathVariable String name, @PathVariable String password) {
		
		//For each map entry of players, check if the name coincide.
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
			if(entry.getValue().getPlayer_name().equals(name)){
        		return 0;
        	}
		}
		
		//If name exists in users map, check if password coincide.
		if(users.get(name) != null) {
			byte[] decodedBytes = Base64.getDecoder().decode(users.get(name));
			String decodedPassword = new String(decodedBytes);
			
			//If password coincide, return 2 (all perfect), if not, return 1 (password missmatch).
			if(decodedPassword.equals(password)){
        		return 2;
        	} else {
        		return 1;
        	}
		//If name doesn't exist in users map, create a new player on it with that name and password.
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
	
	//GET to obtain all PUBLIC INFORMATION from players.
	@GetMapping("/data/{id}")
		public Collection<PlayerData> playerData(@PathVariable long id) {
		
		Collection<PlayerData> playerList = new ArrayList<PlayerData>();
		
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
		    PlayerData pData = new PlayerData();
			pData.setPlayer_name(entry.getValue().getPlayer_name());
			pData.setCharacter_selection(entry.getValue().getCharacter_selection());
			pData.setPlayer_ready(entry.getValue().isPlayer_ready());
			pData.setId(entry.getValue().getId());
			playerList.add(pData);
		}
		
		//Update the player last get for the timer check.
		playerLastGet[(int)id] = Calendar.getInstance().getTime().getTime();
		
		return playerList;
	}
	
	//GET that returns the number of players connected.
	@GetMapping("/data/playercount")
	public int playerCount() {
		return players.size();
	}
	
	//GET that returns the new chat messages.
	@GetMapping("/chat")
	public String getNewChat() {
	return newChatMessages;
}

	//POST to add a new player to the server.
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer(@RequestBody Player player) {

		//Id of the new player and the password encoded in Base64.
		long id = nextId;
		String encodedPassword = Base64.getEncoder().encodeToString(player.getPlayer_password().getBytes());

		player.setId(id);
		player.setPlayer_password(encodedPassword);
		
		//Put the player on the map.
		System.out.println("ID ENTRANTE: " + id);
		players.put(id, player);
		
		//Write the last get (it's actually the first this time).
		playerLastGet[(int)id] = Calendar.getInstance().getTime().getTime();
		
		//Set the timer ON for its id.
		playerTimers[(int)id] = new Timer();
		playerTimers[(int)id].scheduleAtFixedRate(new TimerTask() {

            @Override
            public void run() {
              compruebaJugador(id);
            }
        }, 1000,500);
		
		//Write the info of the connected player in the log file.
		try {
            App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
            String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
            App.writer.write(connectTime + " - Player connected: " + player.getPlayer_name()
            + ", id: " + player.getId() + ", IP: " + player.getPlayer_ip() + "\n");
            App.writer.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
		
		//Show in chat the connected player.
		String stToAdd = player.getPlayer_name() + " has connected.<br />";
		newChatMessages += stToAdd;
		
		nextId++;

		return player;
	}
	
	//POST that adds chat messages.
	@PostMapping("/chat/")
	@ResponseStatus(HttpStatus.CREATED)
	public void addChatText(@RequestBody String strToAdd) {
		String stToAdd = strToAdd;
		stToAdd = stToAdd.replace("\"", "");
		newChatMessages += stToAdd;
		
		//Write the chat message in the log file.
				try {
		            App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
		            String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
		            String chatMsg = stToAdd.replace("<span style ='color:#FF0000; font-weight: bold'>","");
		            chatMsg = chatMsg.replace("<span style ='color:black; font-weight: normal'>","");
		            chatMsg = chatMsg.replace("<br />","");
		            App.writer.write(connectTime + " - Player message - " + chatMsg + "\n");
		            App.writer.close();
		            
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
	}

	//PUT that updates a player's character selection.
	@PutMapping("/data/{id}")
	public ResponseEntity<Player> actulizaPlayer(@PathVariable long id, @RequestBody int cs) {
		Player player = players.get((long)id);
		player.setId(id);
		player.setCharacter_selection(cs);
		players.remove((long)id);
		players.put((long)id, player);
		
		//Add to chat the info of the selected character.
		String stToAdd = "";
		switch(cs) {
		case -1:
			stToAdd = player.getPlayer_name() + " has deselected it role.<br />";
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
		newChatMessages += stToAdd;
		
		//Write the info of the character selection in the log file.
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

	//DELETE to disconnect a player from the server.
	@DeleteMapping("/{id}")
	public ResponseEntity<Player> borraPlayer(@PathVariable long id) {
		Player deletedPlayer = players.get(id);
		
		if (deletedPlayer != null) {
			players.remove(id);
			
			//Update the timers depending on what player disconnected.
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
			} else {
				playerTimers[2].cancel();
			}
			
			//Decrement the nextId because disconnected a player.
			nextId--;
			
			//Write the disconnected player on the log file.
			try {
	            App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
	            String disconnectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
	            App.writer.write(disconnectTime + " - Player disconected: " + deletedPlayer.getPlayer_name()
	            + ", id: " + deletedPlayer.getId() + ", IP: " + deletedPlayer.getPlayer_ip() + "\n");
	            App.writer.close();
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
			
			//Show in chat the disconnected player.
			String stToAdd = deletedPlayer.getPlayer_name() + " has disconnected.<br />";
			newChatMessages += stToAdd;
			
			return new ResponseEntity<>(deletedPlayer, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	//Method that checks if a player disconnects.
	public void compruebaJugador(long id) {
		long actualTime = Calendar.getInstance().getTime().getTime();
			//If the last get was more than one second ago, delete/disconnect the player from the server.
			if (playerLastGet[(int) id] < (actualTime - 3000)) {
				System.out.print("Timer desconecta al jugador " + id + ". PLG: " +
						playerLastGet[(int) id] + " | AT: " + actualTime + "\n");
				borraPlayer(id);
			}
	}
}

