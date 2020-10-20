import { Component, OnInit } from "@angular/core";
import { Empleado } from "src/app/clases/empleado";
import { EmpleadoService } from "src/app/services/empleado.service";

enum OpcionForm {
  ALTA = "Alta",
  MODIFICACION = "Modificación",
  BAJA = "Baja",
}

@Component({
  selector: "app-form-empleados",
  templateUrl: "./form-empleados.component.html",
  styleUrls: ["./form-empleados.component.scss"],
})
export class FormEmpleadosComponent implements OnInit {
  // @Input() opcion: OpcionForm;
  // @Input() empleado: Empleado;
  empleado: Empleado;

  popoverOptions = {
    header: "Seleccione el tipo",
    translucent: true,
    cancelText: "Cerrar",
    okText: "Guardar",
  };

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit() {}

  sacarFoto() {}

  altaEmpleado() {
    console.log("Crear Empleado");

    if (this.empleado) {
      this.empleado.foto = "_";
      console.log(this.empleado);
      this.empleadoService.crear(this.empleado);
    }
  }

  modificarEmpleado() {
    console.log("Modificar Empleado");

    if (this.empleado) {
      //this.empleado.foto = "_";
      console.log(this.empleado);
      this.empleadoService.actualizar(this.empleado);
    }
  }

  borrarEmpleado() {
    console.log("Modificar Empleado");

    if (this.empleado) {
      //this.empleado.foto = "_";
      console.log(this.empleado);
      this.empleadoService.actualizar(this.empleado);
    }
  }
}
