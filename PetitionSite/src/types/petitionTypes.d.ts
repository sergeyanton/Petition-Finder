type Petition= {
    petitionId: number,
    title: string,
    categoryId: number,
    creationDate: string,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    supportingCost: number
    description: string,
    moneyRaised: number,
    supportTiers: SupportTier[]
}

type PetitionPost = {
    title: string,
    description: string,
    categoryId: number,
    supportTiers: SupportTierPost[]
}

type PetitionSearchParameters = {
    startIndex?: number,
    count?: number,
    q?: string,
    categoryId?: number,
    categoryIds?: number[],
    supportingCost?: number,
    ownerId?: number,
    supporterId?: number,
    sortBy?: string
}

type PetitionReturn = {
    petitions: Petition[],
    count: number
}

type SupportTierPost = {
    title: string,
    description: string
    cost: number
}

type SupportTier = {
    supportTierId: number,
} & SupportTierPost

type petitionFull = {
    description: string,
    moneyRaised: number,
    supportTiers: SupportTier[]
} & Petition

type Category = {
    categoryId: number,
    name: string
}

type PostSupport = {
    supportTierId: number,
    message: string
}

type Supporter = {
    supportId: number,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    timestamp: string
} & PostSupport
