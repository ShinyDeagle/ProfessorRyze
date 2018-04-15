package com.nisovin.magicspells.util;

import de.slikey.effectlib.util.ParticleEffect;
import de.slikey.effectlib.util.ParticleEffect.ParticleData;

public class EffectPackage {
	
	public ParticleEffect effect;
	public ParticleData data;
	
	public EffectPackage(ParticleEffect effect, ParticleData data) {
		this.effect = effect;
		this.data = data;
	}
	
}