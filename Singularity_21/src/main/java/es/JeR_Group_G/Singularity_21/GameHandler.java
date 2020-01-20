package es.JeR_Group_G.Singularity_21;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
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
	JsonNode infoNode1;
	JsonNode infoNode2;
	
	JsonNode humanItemToAndroid1;
	JsonNode humanItemToAndroid2;
	JsonNode humanInteracToAndroid1;
	JsonNode humanInteracToAndroid2;
	
	Queue<JsonNode> android1ToAndroid2 = new LinkedList<JsonNode>();
	Queue<JsonNode> android1ToHuman = new LinkedList<JsonNode>();
	Queue<JsonNode> android2ToAndroid1 = new LinkedList<JsonNode>();
	Queue<JsonNode> android2ToHuman = new LinkedList<JsonNode>();
	
	//Method called after a player enters the game.
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("New player: " + session.getId());
		sessions.put(session.getId(), session);
		
		//Write the connected player in the log file.
		/*try {
			App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
			String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			App.writer.write(connectTime + " - WS - Player" + session.getId() +  " connected.\n");
			App.writer.close();
		            
		} catch (Exception e) {
		    e.printStackTrace();
		}*/
	}
	
	//Method called after a player disconnects from game.
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Session closed: " + session.getId());
		sessions.remove(session.getId());
		
		//Write the disconnected player in the log file.
		/*try {
			App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
			String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			App.writer.write(connectTime + " - WS - Player" + session.getId() +  " disconnected.\n");
			App.writer.close();
		            
		} catch (Exception e) {
		    e.printStackTrace();
		}*/
	}
	
	//Method that receives a message and send it to the other players.
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		//System.out.println("Message received from session " + session.getId() + ": " + message.getPayload());
		JsonNode node = mapper.readTree(message.getPayload());
		
		//Write the message in the log file.
				/*try {
					App.writer = new BufferedWriter(new FileWriter(App.logFile, true));
					String connectTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
					App.writer.write(connectTime + " - WS - Message received from session " + session.getId() + ": " + message.getPayload() + "\n");
					App.writer.close();
				            
				} catch (Exception e) {
				    e.printStackTrace();
				}*/
		if(node.get("id").asText().equals("2"))
			android1ActivatedObject(session, node);
		else if(node.get("id").asText().equals("3"))
			android2ActivatedObject(session, node);
		else if(node.get("id").asText().equals("m")) //male android
			updateAndroid1Info(session, node);
		else if(node.get("id").asText().equals("f")) //female android
			updateAndroid2Info(session, node);
		else if(node.get("id").asText().equals("h")) //female android
			updateHumanInfo(session, node);
		else if(node.get("id").asText().equals("4"))
			humanActivatedObject(session, node);
		else if(node.get("id").asText().equals("5"))
			humanSpawnedItem(session, node);
			
	}

	/*private void sendOtherParticipants(WebSocketSession session, JsonNode node) throws IOException {
		//System.out.println("Message sent: " + node.toString());
		//Send the message to each player of the game.
		for(WebSocketSession participant : sessions.values()) {
			if(!participant.getId().equals(session.getId())) {
				participant.sendMessage(new TextMessage(node.toString()));
			}
		}
	}*/
	
	private void updateAndroid1Info(WebSocketSession session, JsonNode node) throws IOException {
		infoNode1 = node.get("ms");
		
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("id", "a");
		newNode.put("ms", infoNode1);
		newNode.put("ms2", infoNode2);
		
		session.sendMessage(new TextMessage(newNode.toString()));
		if(humanInteracToAndroid1 != null) {
			session.sendMessage(new TextMessage(humanInteracToAndroid1.toString()));
			humanInteracToAndroid1 = null;
		}
		if(humanItemToAndroid1 != null) {
			session.sendMessage(new TextMessage(humanItemToAndroid1.toString()));
			humanItemToAndroid1 = null;
		}
		
		for(int i=0; i<android2ToAndroid1.size(); i++) {
			session.sendMessage(new TextMessage(android2ToAndroid1.poll().toString()));
		}
	}
	
	private void updateAndroid2Info(WebSocketSession session, JsonNode node) throws IOException {
		infoNode2 = node.get("ms");
		
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("id", "a");
		newNode.put("ms", infoNode1);
		newNode.put("ms2", infoNode2);
		
		session.sendMessage(new TextMessage(newNode.toString()));
		if(humanInteracToAndroid2 != null) {
			session.sendMessage(new TextMessage(humanInteracToAndroid2.toString()));
			humanInteracToAndroid2 = null;
		}
		if(humanItemToAndroid2 != null) {
			session.sendMessage(new TextMessage(humanItemToAndroid2.toString()));
			humanItemToAndroid2 = null;
		}
		
		for(int i=0; i<android1ToAndroid2.size(); i++) {
			session.sendMessage(new TextMessage(android1ToAndroid2.poll().toString()));
		}
	}
	
	private void updateHumanInfo(WebSocketSession session, JsonNode node) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("id", "a");
		newNode.put("ms", infoNode1);
		newNode.put("ms2", infoNode2);
		
		session.sendMessage(new TextMessage(newNode.toString()));

		for(int i=0; i<android1ToHuman.size(); i++) {
			session.sendMessage(new TextMessage(android1ToHuman.poll().toString()));
		}
		for(int i=0; i<android2ToHuman.size(); i++) {
			session.sendMessage(new TextMessage(android2ToHuman.poll().toString()));
		}
	}
	
	private void humanActivatedObject(WebSocketSession session, JsonNode node) throws IOException{
		humanInteracToAndroid1 = node;
		humanInteracToAndroid2 = node;
	}
	
	private void humanSpawnedItem(WebSocketSession session, JsonNode node) throws IOException{
		humanItemToAndroid1 = node;
		humanItemToAndroid2 = node;
	}
	
	private void android1ActivatedObject(WebSocketSession session, JsonNode node) throws IOException{
		android1ToAndroid2.add(node);
		android1ToHuman.add(node);
	}
	
	private void android2ActivatedObject(WebSocketSession session, JsonNode node) throws IOException{
		android2ToAndroid1.add(node);
		android2ToHuman.add(node);
	}

}
