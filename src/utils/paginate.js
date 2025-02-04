
export default function Pagination ({page,limit}) {
    const _page = page ?? 1;
    const _limit = limit ?? 5;
    const _skip = _limit * (_page - 1)
    return {
        _page,
        _limit,
        _skip
    }
}