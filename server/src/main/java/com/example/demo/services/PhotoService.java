package com.example.demo.services;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Component
public class PhotoService {
    @Autowired
    ServletContext context;

    public Map<String,String> savePicture(MultipartFile multipartFile) throws IOException {
        String error=validatePicture(multipartFile);
        Map<String,String>response=new HashMap<>();
        if(error.equals("none")) {
            String absolutePath = context.getContextPath() + "photos/";
            String generatedString = RandomStringUtils.randomAlphanumeric(50);
            //to prevent others from guessing image name's
            //image name will be random alphanumeric string of length 50 + current time in millis + image's original name
            final String imageName = generatedString + System.currentTimeMillis() + multipartFile.getOriginalFilename();
            Path path = Paths.get(absolutePath + imageName);
            File file = new File(path.toUri());
            if (file.createNewFile()) {
                FileOutputStream fileOutputStream = new FileOutputStream(file);
                fileOutputStream.write(multipartFile.getBytes());
                fileOutputStream.close();
               response.put("imageName",imageName);
            }

        }else response.put("error",error);
        return response;
    }




        private String validatePicture(MultipartFile multipartFile) {
        String error;
        if (!multipartFile.isEmpty() || multipartFile.getSize() > 0) {
            if (multipartFile.getContentType().toLowerCase().equals("image/jpg")
                    || multipartFile.getContentType().toLowerCase().equals("image/jpeg")
                    || multipartFile.getContentType().toLowerCase().equals("image/png")) {
                error = "none";
            } else error = "Error. Should be of  .jpg, .jpeg or .png format";

        } else error = "Error. File can not be empty";
        return error;
    }
}
