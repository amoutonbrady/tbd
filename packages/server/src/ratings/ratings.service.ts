import { Injectable } from '@nestjs/common';
import { Prisma, Rating } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import Got from 'got';
import { chromium } from 'playwright';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class RatingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cities: CitiesService,
  ) {}

  create(data: Prisma.RatingCreateInput) {
    return this.prisma.rating.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RatingWhereUniqueInput;
    where?: Prisma.RatingWhereInput;
    orderBy?: Prisma.RatingOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    const total = await this.prisma.rating.count();
    const ratings = await this.prisma.rating.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        categories: true,
      },
    });

    return [ratings, total] as const;
  }

  async loadExternalRatings(id: number, user: number) {
    const { slug, insee } = await this.cities.findOne({ id });
    const pathname = `${slug}_${insee.replace(/^0+/, '')}`;
    // TODO: Credit source
    const source = `https://www.ville-ideale.fr/${pathname}`;

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(source, { referer: source });

    console.log(source);

    const data = await page.evaluate(() => {
      const $ratings = document.querySelectorAll('.comm');

      const ratings = Array.from($ratings).map<any>((rating) => {
        const [author, pros, cons, votes] = rating.querySelectorAll('p');
        const [upvotes, downvotes] = votes.textContent.match(/\d+/g);
        const [
          environnement,
          transports,
          securite,
          sante,
          sports,
          culture,
          enseignement,
          commerces,
          qualite,
        ] = rating.querySelectorAll('tr:nth-child(2) td');

        return {
          pros: pros.textContent.replace('Les points positifs : ', ''),
          cons: cons.textContent.replace('Les points positifs : ', ''),
          upvotes: parseInt(upvotes, 10),
          downvotes: parseInt(downvotes, 10),
          categories: {
            create: [
              {
                note: parseInt(environnement.textContent, 10),
                ratingCategory: { connect: { slug: 'environnement' } },
              },

              {
                note: parseInt(transports.textContent, 10),
                ratingCategory: { connect: { slug: 'transports' } },
              },

              {
                note: parseInt(securite.textContent, 10),
                ratingCategory: { connect: { slug: 'securite' } },
              },

              {
                note: parseInt(sante.textContent, 10),
                ratingCategory: { connect: { slug: 'sante' } },
              },

              {
                note: parseInt(sports.textContent, 10),
                ratingCategory: { connect: { slug: 'sports-et-loisirs' } },
              },

              {
                note: parseInt(culture.textContent, 10),
                ratingCategory: { connect: { slug: 'culture' } },
              },

              {
                note: parseInt(enseignement.textContent, 10),
                ratingCategory: { connect: { slug: 'enseignement' } },
              },

              {
                note: parseInt(commerces.textContent, 10),
                ratingCategory: { connect: { slug: 'commerces' } },
              },

              {
                note: parseInt(qualite.textContent, 10),
                ratingCategory: { connect: { slug: 'qualite-de-vie' } },
              },
            ],
          },
        };
      });

      return ratings;
    });

    const ratings = [];

    for (const rating of data) {
      const entry = await this.create({
        source,
        city: { connect: { id } },
        user: { connect: { id: user } },
        ...rating,
      });

      ratings.push(entry);
    }

    return ratings;
  }

  findOne(where: Prisma.RatingWhereUniqueInput) {
    return this.prisma.rating.findFirst({ where });
  }

  update(params: {
    where: Prisma.RatingWhereUniqueInput;
    data: Prisma.RatingUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.rating.update({
      where,
      data,
    });
  }

  remove(where: Prisma.RatingWhereUniqueInput) {
    return this.prisma.rating.delete({
      where,
    });
  }
}
