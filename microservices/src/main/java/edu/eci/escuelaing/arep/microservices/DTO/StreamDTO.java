package edu.eci.escuelaing.arep.microservices.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StreamDTO {

    private Long id;
    private String name; 
    private List<PostDTO> posts;

}
