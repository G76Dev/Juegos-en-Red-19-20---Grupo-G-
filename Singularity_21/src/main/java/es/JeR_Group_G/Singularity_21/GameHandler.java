package es.JeR_Group_G.Singularity_21;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class GameHandler extends TextWebSocketHandler {

	//Map of ws sessions.
	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	//ObjectMapper to read ws messages.
	private ObjectMapper mapper = new ObjectMapper();
	
	//Method called after a player enters the game.
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("New player: " + session.getId());
		sessions.put(session.getId(), session);
		
		//Write the connected player in the log file.
		try {
			App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
			String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			App.writer.write(connectTime + " - WS - Player" + session.getId() +  " connected.\n");
			App.writer.close();
		            
		} catch (Exception e) {
		    e.printStackTrace();
		}
	}
	
	//Method called after a player disconnects from game.
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Session closed: " + session.getId());
		sessions.remove(session.getId());
		
		//Write the disconnected player in the log file.
		try {
			App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
			String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			App.writer.write(connectTime + " - WS - Player" + session.getId() +  " disconnected.\n");
			App.writer.close();
		            
		} catch (Exception e) {
		    e.printStackTrace();
		}
	}
	
	//Method that receives a message and send it to the other players.
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message received from session " + session.getId() + ": " + message.getPayload());
		JsonNode node = mapper.readTree(message.getPayload());
		
		//Write the message in the log file.
				try {
					App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
					String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
					App.writer.write(connectTime + " - WS - Message received from session " + session.getId() + ": " + message.getPayload() + "\n");
					App.writer.close();
				            
				} catch (Exception e) {
				    e.printStackTrace();
				}
		
		sendOtherParticipants(session, node);
	}

	private void sendOtherParticipants(WebSocketSession session, JsonNode node) throws IOException {
		System.out.println("Message sent: " + node.toString());
		
		ObjectNode newNode = mapper.createObjectNode();
		//Aquí iría la info que pasamos y recibimos como mensajes.
		newNode.put("name", node.get("name").asText());
		newNode.put("message", node.get("message").asText());
		
		//Send the message to each player of the game.
		for(WebSocketSession participant : sessions.values()) {
			if(!participant.getId().equals(session.getId())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
	}

}
