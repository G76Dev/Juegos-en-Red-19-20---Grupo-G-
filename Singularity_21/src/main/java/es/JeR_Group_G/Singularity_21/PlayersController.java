package es.JeR_Group_G.Singularity_21;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

	Map<Long, Player> players = new ConcurrentHashMap<>(); 
	long nextId = 0;
	
	@GetMapping
	public Collection<Player> players() {
		return players.values();
	}
	
	@GetMapping("/data")
	public Collection<PlayerData> playerDataAll() {
	
	Collection<PlayerData> playerList = new ArrayList<PlayerData>();
	
	for (Map.Entry<Long, Player> entry : players.entrySet()) {
	    //System.out.println(entry.getKey() + "/" + entry.getValue());
	    PlayerData pData = new PlayerData();
		pData.setPlayer_name(entry.getValue().getPlayer_name());
		pData.setCharacter_selection(entry.getValue().getCharacter_selection());
		pData.setPlayer_ready(entry.getValue().isPlayer_ready());
		playerList.add(pData);
	}
	
	return playerList;
}
	
	@GetMapping("/data/{id}")
		public Collection<PlayerData> playerData(@PathVariable long id) {
		
		Collection<PlayerData> playerList = new ArrayList<PlayerData>();
		
		for (Map.Entry<Long, Player> entry : players.entrySet()) {
		    //System.out.println(entry.getKey() + "/" + entry.getValue());
		    PlayerData pData = new PlayerData();
			pData.setPlayer_name(entry.getValue().getPlayer_name());
			pData.setCharacter_selection(entry.getValue().getCharacter_selection());
			pData.setPlayer_ready(entry.getValue().isPlayer_ready());
			playerList.add(pData);
		}
		
		playerLastGet[(int)id] = Calendar.getInstance().getTime().getTime();
		
		
		return playerList;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer(@RequestBody Player player) {

		long id = nextId;
		
		player.setId(id);
		player.setPlayer_name("player" + id);
		players.put(id, player);
		
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
		
		nextId++;

		return player;
	}

	@PutMapping("/{id}")
	public ResponseEntity<Player> actulizaPlayer(@PathVariable long id, @RequestBody Player playerActualizado) {

		Player savedPlayer = players.get(playerActualizado.getId());

		if (savedPlayer != null) {

			players.put(id, playerActualizado);

			return new ResponseEntity<>(playerActualizado, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
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

	@DeleteMapping("/{id}")
	public ResponseEntity<Player> borraPlayer(@PathVariable long id) {

		Player deletedPlayer = players.get(id);
		
		if (deletedPlayer != null) {
			players.remove(deletedPlayer.getId());
			if(id == 0) {
				if (nextId > 1) {
					players.get(1).setId(0);
					playerTimers[1].cancel();
				}
				if (nextId > 2) {
					players.get(2).setId(1);
					playerTimers[2].cancel();
				} else {
					playerTimers[0].cancel();
				}
			} else if (id == 1) {
				if (nextId > 2) {
					players.get(2).setId(1);
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
			return new ResponseEntity<>(deletedPlayer, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	public void compruebaJugador(long id) {
		long actualTime = Calendar.getInstance().getTime().getTime();
			if (playerLastGet[(int) id] < (actualTime - 2000)) {
				borraPlayer(id);
			}
	}
}

