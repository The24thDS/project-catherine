package com.example.demo.models.payloads.PayloadModels;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomCommentDetails implements Serializable {

    String date;
    String text;
}
