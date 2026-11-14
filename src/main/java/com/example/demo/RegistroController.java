package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registro")
@CrossOrigin(origins = "*")
public class RegistroController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EmprendedorRepository emprendedorRepository;

    @PostMapping("/cliente")
    public ResponseEntity<Cliente> registrarCliente(@RequestBody Cliente nuevoCliente) {
        Cliente guardado = clienteRepository.save(nuevoCliente);
        return ResponseEntity.ok(guardado);
    }

    @PostMapping("/emprendedor")
    public ResponseEntity<Emprendedor> registrarEmprendedor(@RequestBody Emprendedor nuevoEmprendedor) {
        Emprendedor guardado = emprendedorRepository.save(nuevoEmprendedor);
        return ResponseEntity.ok(guardado);
    }
}
