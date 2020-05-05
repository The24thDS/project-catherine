package com.example.demo.models.payloads.requests;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
@Getter
@Setter
public class PostRequest {
    ArrayList<String>photos;
    String content;
}
