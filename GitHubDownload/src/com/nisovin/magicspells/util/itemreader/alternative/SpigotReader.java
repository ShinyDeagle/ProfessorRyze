package com.nisovin.magicspells.util.itemreader.alternative;

import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.inventory.ItemStack;

import java.util.Map;

public class SpigotReader implements ItemConfigTransformer {
	
	@Override
	public ItemStack deserialize(ConfigurationSection section) {
		if (section == null) return null;
		return ItemStack.deserialize(section.getValues(false));
	}
	
	@Override
	public Map<String, Object> serialize(ItemStack itemStack) {
		return itemStack.serialize();
	}
	
}
