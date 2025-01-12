import { NextRequest, NextResponse } from "next/server";

import useTmdbFetch from "@/components/hooks/tmdb";

import { checkAvailability } from "@/components/utils/tmdbApiData/availability";

type ParamProps = {
    genre: string;
};

export async function GET( req: NextRequest, { params } : { params: Promise<ParamProps> } ) {

    const { fetchSeriesByGenre, fetchReleasedSeries } = useTmdbFetch();
    const { genre } = await params;
    const query = req.nextUrl.searchParams;
    const page = query.get('page') ? Number(query.get('page')) : 1;

    if ( genre === 'release' ) {
        const releaseSeries = await fetchReleasedSeries( page );
        const filtered = await checkAvailability( releaseSeries );
        return NextResponse.json({ series: filtered, page });
    };

    const series = await fetchSeriesByGenre( genre, page );
    const filtered = await checkAvailability( series );
    return NextResponse.json({ series: filtered, page });
};