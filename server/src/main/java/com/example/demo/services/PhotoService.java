package com.example.demo.services;
import com.example.demo.exceptions.InvalidPhotoException;
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
@Component
public class PhotoService {
    @Autowired
    ServletContext context;

    public String savePicture(MultipartFile multipartFile) throws IOException {
        String response="";
        if(validatePicture(multipartFile)) {
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
               response=imageName;
            }

        }
        return response;
    }
        private boolean validatePicture(MultipartFile multipartFile) {
        if (!multipartFile.isEmpty() || multipartFile.getSize() > 0) {
            if (multipartFile.getContentType().toLowerCase().equals("image/jpg")
                    || multipartFile.getContentType().toLowerCase().equals("image/jpeg")
                    || multipartFile.getContentType().toLowerCase().equals("image/png")) {
                return true;
            } else throw new InvalidPhotoException("Photos should only be of .JPG, .JPEG, ,PNG format");

        } else throw new InvalidPhotoException("Can't upload empty photos");
    }
}
