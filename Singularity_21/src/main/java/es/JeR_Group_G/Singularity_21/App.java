package es.JeR_Group_G.Singularity_21;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class App implements WebSocketConfigurer  {
	//Create a temporary file
	public static BufferedWriter writer = null;
    public static String timeLog = new SimpleDateFormat("dd-MM-yyyy_HH-mm-ss").format(Calendar.getInstance().getTime());
    public static File logFile = new File("src/main/resources/logs/log_" + timeLog + ".txt");
    
    public static void main( String[] args )
    {
    	//Run the server
    	SpringApplication.run(App.class, args);
    	
        try {
        	//Write on the log .txt file.
            writer = new BufferedWriter(new FileWriter(logFile));
            String openTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
            writer.write(openTime + " - Server opened\n");
            writer.close();
            
            //Read all users from the users file.
            File file = new File("src/main/resources/users.txt"); 
            BufferedReader br = new BufferedReader(new FileReader(file)); 
            
            String[] splitStringInfo;
            String st;
            while ((st = br.readLine()) != null) {
            	splitStringInfo = st.split(":");
            	PlayersController.users.put(splitStringInfo[0], splitStringInfo[1]);
            }
            br.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    //Add the game handler.
  	@Override
  	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
  		registry.addHandler(createGameHandler(), "/game")
  			.setAllowedOrigins("*");
  	}
  	
  	//Returns a new GameHandler.
  	@Bean
  	public GameHandler createGameHandler() {
  		return new GameHandler();
  	}
} //End of App class.
