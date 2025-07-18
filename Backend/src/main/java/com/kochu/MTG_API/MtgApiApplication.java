package com.kochu.MTG_API;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MtgApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MtgApiApplication.class, args);
	}

}
