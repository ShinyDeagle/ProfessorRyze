package com.nisovin.magicspells.spells.targeted;

import com.nisovin.magicspells.MagicSpells;
import org.bukkit.entity.Player;

import com.nisovin.magicspells.spells.TargetedSpell;
import com.nisovin.magicspells.util.MagicConfig;
import com.nisovin.magicspells.util.TargetInfo;

public class ResourcePackSpell extends TargetedSpell {
	
	public static final int HASH_LENGTH = 20;

	private String url = null;
	private byte[] hash = null;
	
	public ResourcePackSpell(MagicConfig config, String spellName) {
		super(config, spellName);
		url = getConfigString("url", null);
		String hashString = getConfigString("hash", null);
		if (hashString != null) {
			hash = hashString.getBytes();
			
			if (hash.length != HASH_LENGTH) {
				// Send the message
				MagicSpells.error("Incorrect length for resource pack hash: " + hash.length);
				MagicSpells.error("Avoiding use of the hash to avoid further problems.");
				// Null it to prevent further errors
				hash = null;
			}
		}
		
	}
	
	@Override
	public PostCastAction castSpell(Player player, SpellCastState state, float power, String[] args) {
		if (state == SpellCastState.NORMAL) {
			TargetInfo<Player> target = getTargetedPlayer(player, power);
			Player targetPlayer = target.getTarget();
			if (targetPlayer == null) return noTarget(player);
			sendResourcePack(player);
			return PostCastAction.HANDLE_NORMALLY;
		}
		return PostCastAction.HANDLE_NORMALLY;
	}
	
	private void sendResourcePack(Player player) {
		if (hash == null) {
			player.setResourcePack(url);
		} else {
			player.setResourcePack(url, hash);
		}
	}

}
