import { AppDataSource } from "../data-source.js";
import { Medicine } from "../entities/Medicine.js";
import { errorHandler } from "../utils/error.js";

const medicineRepository = AppDataSource.getRepository(Medicine);

export const createMedicine = async (req, res, next) => {
  try {
    const medicine = medicineRepository.create(req.body);
    const savedMedicine = await medicineRepository.save(medicine);
    res.status(201).json(savedMedicine);
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await medicineRepository.findOneBy({ id: req.params.id });

    if (!medicine) {
      return next(errorHandler(404, "Medicine not found!"));
    }
    if (String(req.user.id) !== medicine.userRef) {
      return next(errorHandler(401, "You can only delete your own Medicine!"));
    }

    await medicineRepository.delete(req.params.id);
    res.status(200).json({ message: "Medicine has been deleted!" });
  } catch (error) {
    next(error);
  }
};
