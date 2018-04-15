package com.nisovin.magicspells.util.itemreader.alternative;

import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.inventory.ItemStack;

import java.util.Map;

public interface ItemConfigTransformer {

	// Deserialize this section
	ItemStack deserialize(ConfigurationSection section);
	
	Map<?, ?> serialize(ItemStack itemStack);
	
}
