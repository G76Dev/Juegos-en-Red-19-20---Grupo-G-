package es.JeR_Group_G.Singularity_21;

public class Player {

	private long id;
	private String player_ip;
	private String player_name;
	private String player_password;
	private int character_selection;
	private boolean player_ready;

	public Player() {
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getPlayer_ip() {
		return player_ip;
	}

	public void setPlayer_ip(String player_ip) {
		this.player_ip = player_ip;
	}

	public String getPlayer_name() {
		return player_name;
	}

	public void setPlayer_name(String player_name) {
		this.player_name = player_name;
	}
	
	public String getPlayer_password() {
		return player_password;
	}

	public void setPlayer_password(String player_p) {
		this.player_password = player_p;
	}
	
	public int getCharacter_selection() {
		return character_selection;
	}

	public void setCharacter_selection(int character_selection) {
		this.character_selection = character_selection;
	}

	public boolean isPlayer_ready() {
		return player_ready;
	}

	public void setPlayer_ready(boolean player_ready) {
		this.player_ready = player_ready;
	}

	@Override
	public String toString() {
		return "Player [id=" + id + ", player_ip=" + player_ip + ", player_name=" + player_name
				+ ", character_selection=" + character_selection + ", player_ready=" + player_ready + "]";
	}

}
