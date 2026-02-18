import WithdrawlPage from "@/components/pages/dashboard/userDashboard/withdrawl";
import { getAllGames, getUserGameBalance } from "@/serverApi/game";
import { GameResponseProps } from "@/types/game";

export const dynamic = "force-dynamic";

const EMPTY_GAMES: GameResponseProps = {
    data: {
        data: [],
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 1,
            total_pages: 0,
        },
        message: "",
        success: false,
    },
};

const EMPTY_COINS = {
    data: {
        game_information: {},
    },
};

export default async function Withdrawl() {
    try {
        const [games, coins] = await Promise.all([
            getAllGames(),
            getUserGameBalance(),
        ]);

        return (
            <WithdrawlPage
                games={games || EMPTY_GAMES}
                coins={coins || EMPTY_COINS}
            />
        );
    } catch (error) {
        console.error("Withdrawl Page Server Error:", error);

        return (
            <WithdrawlPage
                games={EMPTY_GAMES}
                coins={EMPTY_COINS}
            />
        );
    }
}
