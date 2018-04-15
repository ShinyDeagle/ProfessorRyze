package com.nisovin.magicspells.util.itemreader.alternative;

import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.inventory.ItemStack;

import java.util.HashMap;
import java.util.Map;

public class AlternativeReaderManager {
	
	public static Map<String, ItemConfigTransformer> readers = new HashMap<>();
	
	static {
		readers.put("external::spigot", new SpigotReader());
	}
	
	public static ItemConfigTransformer getReader(String type) {
		if (type == null) return null;
		return readers.get(type.toLowerCase());
	}
	
	public static ItemStack deserialize(ConfigurationSection configurationSection) {
		if (configurationSection == null) return null;
		
		ItemConfigTransformer transformer = getReader(configurationSection.getString("type"));
		if (transformer == null) return null;
		
		return transformer.deserialize(configurationSection.getConfigurationSection("data"));
	}
	
}
