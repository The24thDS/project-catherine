package com.example.demo.exceptions;

import com.example.demo.models.payloads.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class ExceptionHandlerAtFilterLevel extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            ObjectMapper mapper = new ObjectMapper();
            ApiResponse errorResponse = new ApiResponse("token is expired",false);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.getWriter().write(mapper.writeValueAsString(errorResponse));
        }catch (io.jsonwebtoken.SignatureException e){
            ObjectMapper mapper = new ObjectMapper();
            ApiResponse errorResponse = new ApiResponse("token is invalid",false);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.getWriter().write(mapper.writeValueAsString(errorResponse));
        }

    }
    }

