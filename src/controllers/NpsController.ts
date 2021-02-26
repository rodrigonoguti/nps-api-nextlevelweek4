import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NpsController {

  /**
   * 1 2 3 4 5 6 7 8 9 10
   * Detratores => 0 - 6
   * Passivos => 7 - 8
   * Promotores => 9 - 10
   * 
   * (Número de promotores - Número de detratores) / (Número de respondentes) * 100
   */

  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveysUsers.filter(survey =>
      survey.value >= 0 && survey.value <= 6
    ).length;

    const promoter = surveysUsers.filter(survey =>
      survey.value >= 9 && survey.value <= 10
    ).length;

    const passive = surveysUsers.filter(survey =>
      survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveysUsers.length;

    const nps = Number(
      ((promoter - detractor) / totalAnswers * 100).toFixed(2)
    );

    return res.json({
      detractor,
      promoter,
      passive,
      totalAnswers,
      nps
    });
  }
}

export { NpsController };