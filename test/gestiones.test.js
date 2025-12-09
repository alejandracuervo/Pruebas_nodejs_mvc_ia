const request = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");

describe("API de Gestiones", () => {

  it("Debe listar gestiones (GET /api/gestiones)", async () => {
    const res = await request(app).get("/api/gestiones");

    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
  });

  it("Debe crear una gestión (POST /api/gestiones)", async () => {
    const nuevaGestion = {
      clienteDocumento: "123456789",
      clienteNombre: "Juan Perez",
      asesorId: "A001",
      tipificacion: "Contacto Efectivo",
      canalOficial: true
    };

    const res = await request(app)
      .post("/api/gestiones")
      .send(nuevaGestion);

    expect(res.statusCode).to.equal(201);
    expect(res.body.status).to.equal("success");
    expect(res.body.data).to.have.property("id");
  });

});
