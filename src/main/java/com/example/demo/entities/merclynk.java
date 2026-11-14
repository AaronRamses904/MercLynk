package com.example.demo.entities;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor


public class merclynk {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;    
    @Column(nullable = false, length = 100)
    private String nombre;
    @Column(nullable = false, length = 80)
    private String descubridor;
    @Column(name = "peso_prom", nullable = false)
    private Float pesoPromedio;
    @Column(name = "fecha_desc", nullable = false)
    private LocalDate fechaDescubrimiento;  
}
