function status(request, response) {
  response.status(200).json({ Chave: "Deu bom você vai conseguir" });
}

export default status;
