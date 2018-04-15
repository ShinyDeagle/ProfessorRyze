package com.nisovin.magicspells.spells.targeted;

import java.util.ArrayList;
import java.util.HashSet;

import com.nisovin.magicspells.util.TimeUtil;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.block.Block;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.block.BlockBreakEvent;

import com.nisovin.magicspells.MagicSpells;
import com.nisovin.magicspells.materials.MagicMaterial;
import com.nisovin.magicspells.spelleffects.EffectPosition;
import com.nisovin.magicspells.spells.TargetedEntitySpell;
import com.nisovin.magicspells.spells.TargetedSpell;
import com.nisovin.magicspells.util.MagicConfig;
import com.nisovin.magicspells.util.TargetInfo;

// Special effect position is played in the blocks that are spawned to create the tomb
// Makes use of the BLOCK_DESTRUCTION position
public class EntombSpell extends TargetedSpell implements TargetedEntitySpell {

	MagicMaterial tombBlockType;
	private int tombDuration;
	private boolean closeTopAndBottom;
	private boolean allowBreaking;
	
	HashSet<Block> blocks;
	
	public EntombSpell(MagicConfig config, String spellName) {
		super(config, spellName);

		tombBlockType = MagicSpells.getItemNameResolver().resolveBlock(getConfigString("tomb-block-type", "glass"));
		tombDuration = getConfigInt("tomb-duration", 20);
		closeTopAndBottom = getConfigBoolean("close-top-and-bottom", true);
		allowBreaking = getConfigBoolean("allow-breaking", true);
		
		blocks = new HashSet<>();
		
		if (tombBlockType == null) MagicSpells.error("Entomb spell '" + spellName + "' has an invalid tomb-block-type!");
	}

	@Override
	public PostCastAction castSpell(Player player, SpellCastState state, float power, String[] args) {
		if (state == SpellCastState.NORMAL) {
			TargetInfo<LivingEntity> targetInfo = getTargetedEntity(player, power);
			if (targetInfo != null) {
				LivingEntity target = targetInfo.getTarget();
				Location locationTarget = target.getLocation();
				power = targetInfo.getPower();
				int x = locationTarget.getBlockX();
				int y = locationTarget.getBlockY();
				int z = locationTarget.getBlockZ();
				
				Location loc = new Location(locationTarget.getWorld(), x + .5, y + .5, z + .5, locationTarget.getYaw(), locationTarget.getPitch());
				target.teleport(loc);
				
				createTomb(target, power);
				playSpellEffects(player, target);
				sendMessages(player, target);
				return PostCastAction.NO_MESSAGES;
			}
			return noTarget(player);
		}		
		return PostCastAction.HANDLE_NORMALLY;
	}
	
	private void createTomb(LivingEntity target, float power) {		
		ArrayList<Block> tombBlocks = new ArrayList<>();
		Block feet = target.getLocation().getBlock();
		
		Block temp = feet.getRelative(1, 0, 0);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(1, 1, 0);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(-1, 0, 0);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(-1, 1, 0);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(0, 0, 1);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(0, 1, 1);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(0, 0, -1);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		temp = feet.getRelative(0, 1, -1);
		if (temp.getType() == Material.AIR) {
			tombBlockType.setBlock(temp);
			playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
			tombBlocks.add(temp);
		}
		if (closeTopAndBottom) {
			temp = feet.getRelative(0, -1, 0);
			if (temp.getType() == Material.AIR) {
				tombBlockType.setBlock(temp);
				playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
				tombBlocks.add(temp);
			}
			temp = feet.getRelative(0, 2, 0);
			if (temp.getType() == Material.AIR) {
				tombBlockType.setBlock(temp);
				playSpellEffects(EffectPosition.SPECIAL, temp.getLocation());
				tombBlocks.add(temp);
			}
		}				
		
		if (tombDuration > 0 && !tombBlocks.isEmpty()) {
			blocks.addAll(tombBlocks);
			MagicSpells.plugin.getServer().getScheduler().scheduleSyncDelayedTask(MagicSpells.plugin, new TombRemover(tombBlocks), Math.round(tombDuration * TimeUtil.TICKS_PER_SECOND * power));
		}
	}

	@Override
	public boolean castAtEntity(Player caster, LivingEntity target, float power) {
		if (!validTargetList.canTarget(caster, target)) return false;
		createTomb(target, power);
		playSpellEffects(caster, target);
		return true;
	}

	@Override
	public boolean castAtEntity(LivingEntity target, float power) {
		if (!validTargetList.canTarget(target)) return false;
		createTomb(target, power);
		playSpellEffects(EffectPosition.TARGET, target);
		return true;
	}
	
	@EventHandler
	public void onBlockBreak(BlockBreakEvent event) {
		if (!blocks.contains(event.getBlock())) return;
		event.setCancelled(true);
		if (allowBreaking) event.getBlock().setType(Material.AIR);
	}

	private class TombRemover implements Runnable {

		ArrayList<Block> tomb;
		
		public TombRemover(ArrayList<Block> tomb) {
			this.tomb = tomb;
		}
		
		@Override
		public void run() {
			Material tombBlockMaterial = tombBlockType.getMaterial();
			for (Block block : tomb) {
				if (tombBlockMaterial != block.getType()) continue;
				block.setType(Material.AIR);
				playSpellEffects(EffectPosition.BLOCK_DESTRUCTION, block.getLocation());
			}
			blocks.removeAll(tomb);
		}
		
	}

}
