package es.JeR_Group_G.Singularity_21;

public class PlayerData {
	private long id;
	private String player_name;
	private int character_selection;
	private boolean player_ready;

	public PlayerData() {
	}
	
	public long getId() {
		return id;
	}
	
	public void setId(long i) {
		id = i;
	}

	public String getPlayer_name() {
		return player_name;
	}

	public void setPlayer_name(String player_name) {
		this.player_name = player_name;
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
		return "Player [player_name=" + player_name + ", character_selection=" +
				character_selection + ", player_ready=" + player_ready + "]";
	}
}
