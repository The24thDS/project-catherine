package com.example.demo.controllers;
import com.example.demo.models.payloads.responses.ApiResponse;
import com.example.demo.models.payloads.responses.PhotosUploadResponse;
import com.example.demo.services.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;


@RestController
@RequestMapping("/api/v1/photos")
public class PhotoController {

    @Autowired
    ServletContext context;
    @Autowired
    PhotoService photoService;

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


    @PostMapping
    ResponseEntity<?> uploadPhoto(@RequestParam("photos") MultipartFile[] photos) throws IOException {
        PhotosUploadResponse photosUploadResponse=new PhotosUploadResponse();
        photosUploadResponse.setPhotos(new ArrayList<>());
        if(photos!=null&&photos.length>0) {
            for (MultipartFile photo : photos) {
                photosUploadResponse.getPhotos().add(photoService.savePicture(photo));
            }
            photosUploadResponse.setMessage("Photos have been uploaded successfully");
            photosUploadResponse.setSuccess(true);
        }
        else{
            photosUploadResponse.setMessage("Should contain at least 1 photo");
            photosUploadResponse.setSuccess(false);
        }
        return new ResponseEntity<>(photosUploadResponse,HttpStatus.OK);

    }
}