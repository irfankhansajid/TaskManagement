package com.irfankhansajid.taskmanagement.security;


import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;


    public String generateToken(UserDetails userDetails) {
        
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
            
        }

        private SecretKey getSigningKey() {
            byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            return Keys.hmacShaKeyFor(keyBytes);
        }

        
        
            private String createToken(Map<String, Object> claims, String subject) {
                return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();

            
         }

         public Boolean validateToken(String token, UserDetails userDetails) {
         
            final String username = extractUsername(token);
                return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
                        
            }
            
            public String extractUsername(String token) {
                return extractClaims(token, Claims::getSubject);
            }

            public Date extractExpiration(String token) {
                return extractClaims(token, Claims::getExpiration);
            }

            public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
                final Claims claims = extractAllClaims(token);
                return claimsResolver.apply(claims);
            }

            private Claims extractAllClaims(String token) {
                return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
                
            }

            private Boolean isTokenExpired(String token) {
                return extractExpiration(token).before(new Date());
            }
                

    
}

