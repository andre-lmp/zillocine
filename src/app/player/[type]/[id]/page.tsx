import PlayerPage from "@/components/playerPage"

type PlayerPageProps = {
    params: { id: string, type: string };
}

export default function Player({params: { type, id }} : PlayerPageProps) {
    return <PlayerPage contentId={ id } contentType={ type } />
};