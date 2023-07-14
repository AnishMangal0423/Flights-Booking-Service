class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error) {
      console.log("error in airplane repository");
    }
  }




  async update(data, id) {
    try {
      const response = await this.model.update(data, {
        where: {
          id: id,
        },
      });
      return response;
    } catch (error) {
      console.log("error in airplane repository");
    }
  }




  async getAll() {
    try {
      const response = await this.model.findAll();
      return response;
    } catch (error) {
      console.log("error in airplane repository");
    }
  }


  async get(id) {
  
    const response = await this.model.findByPk(id);
    if(!response){

      throw new AppError(" Somethng Went Wrong .. " , StatusCodes.NOT_FOUND);
     }

    return response;

    }



  async destroy(data) {
    try {
      const response = await this.model.destroy({
        where: {
          id: data,
        },
      });
      return response;
    } catch (error) {
      console.log("error in airplane repository");
    }
  }
}


module.exports=CrudRepository;
