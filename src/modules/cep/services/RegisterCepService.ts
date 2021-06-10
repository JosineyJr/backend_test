import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Cep from '../infra/typeorm/entities/Cep';
import ICepProvider from '../providers/CepProvider/models/ICepProvider';
import ICepsRepository from '../repositories/ICepsRepository';

@injectable()
class RegisterCepService {
  constructor(
    @inject('CepsRepository')
    private cepsRepository: ICepsRepository,
    @inject('CepProvider')
    private cepProvider: ICepProvider,
  ) {}

  public async execute(cep: string): Promise<Cep> {
    if (cep.length < 8 || cep.length > 8)
      throw new AppError('Invalid cep format', 401);

    const allCep = await this.cepsRepository.list();

    const cepFound = allCep.find(findCep => findCep.cep === cep);

    if (!cepFound) {
      const cepData = await this.cepProvider.getAddress(cep);

      const cepRegistered = await this.cepsRepository.register(cepData);

      return cepRegistered;
    }

    return cepFound;
  }
}

export default RegisterCepService;