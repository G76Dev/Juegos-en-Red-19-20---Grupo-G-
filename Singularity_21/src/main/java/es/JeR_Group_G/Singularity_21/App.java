package es.JeR_Group_G.Singularity_21;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App 
{
	public static BufferedWriter writer = null;
	//create a temporary file
    public static String timeLog = new SimpleDateFormat("dd-MM-yyyy_HH-mm-ss").format(Calendar.getInstance().getTime());
    public static File logFile = new File("src/main/resources/static/logs/log_" + timeLog + ".txt");
    public static void main( String[] args )
    {
    	SpringApplication.run(App.class, args);
    	
        try {
            writer = new BufferedWriter(new FileWriter(logFile));
            String openTime = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
            writer.write(openTime + " - Server opened\n");
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        PlayersController pc = new PlayersController();
        
    }
}

//Como el minecraft, leer ip al abrir el servidor
//server-ip:192.168.1.X
//IP ORDENADOR GRANDE CLASE: 10.10.144.80