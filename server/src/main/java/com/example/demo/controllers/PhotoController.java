package com.example.demo.controllers;
import com.example.demo.models.payloads.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/api/v1/photos")
public class PhotoController {

    @Autowired
    ServletContext context;


    @GetMapping("/get/{fileName:.+}")
    ResponseEntity<?> download(@PathVariable String fileName, HttpServletRequest request) throws IOException {
        final String absolutePath = context.getContextPath() + "photos/";
        Path filePath = Paths.get(absolutePath + fileName);
        Resource resource = null;
        try {
            resource = new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.OK);
        }
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            return new ResponseEntity<>(new ApiResponse(ex.getMessage(), false), HttpStatus.OK);
        }


        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        byte[] bytes = StreamUtils.copyToByteArray(resource.getInputStream());
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(bytes);
    }






}
