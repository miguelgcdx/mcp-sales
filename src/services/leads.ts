import type { LeadStatus } from '@/generated/prisma/client';

import { prisma } from '@/db/prisma';

export async function findLeadByEmail(email: string) {
  return prisma.lead.findUnique({
    where: {
      email,
    },
    include: {
      company: true,
    },
  });
}

export async function findLeadById(id: string) {
  return prisma.lead.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
    },
  });
}

export async function searchLeads(query: string) {
  return prisma.lead.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          need: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          company: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      company: true,
    },
  });
}

export async function updateLeadStatus(
  email: string,
  status: LeadStatus,
) {
  return prisma.lead.update({
    where: {
      email,
    },
    data: {
      status,
    },
    include: {
      company: true,
    },
  });
}
