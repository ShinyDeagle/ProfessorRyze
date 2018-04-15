package com.nisovin.magicspells.spells.instant;

import com.nisovin.magicspells.spelleffects.EffectPosition;
import com.nisovin.magicspells.spells.InstantSpell;
import com.nisovin.magicspells.util.MagicConfig;
import org.bukkit.entity.Player;
import org.bukkit.util.Vector;

// This spell currently just sets your velocity based upon the direction you are looking
// As a prodiuct of the cast power and the 'speed' option
// More will come soon.
public class VelocitySpell extends InstantSpell {
	
	private double speed;
	
	public VelocitySpell(MagicConfig config, String spellName) {
		super(config, spellName);
		
		this.speed = getConfigDouble("speed", 4.0);
	}
	
	@Override
	public PostCastAction castSpell(Player player, SpellCastState state, float power, String[] args) {
		if (state == SpellCastState.NORMAL) {
			Vector v = player.getEyeLocation().getDirection();
			v = v.normalize();
			v = v.multiply(speed * power);
			player.setVelocity(v);
			playSpellEffects(EffectPosition.CASTER, player);
		}
		
		return PostCastAction.HANDLE_NORMALLY;
	}
	
}
