package edu.eci.escuelaing.arep.microservices.DTO;

import edu.eci.escuelaing.arep.microservices.Model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PostDTO {

    private Long id;
    private String message;
    private User user;
    private int likes;
    
    
}
