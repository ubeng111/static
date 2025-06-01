export default function isTextMatched(category, match) {
    if (category !== undefined && match !== "") {
        if (category.toLocaleLowerCase() === match.toLocaleLowerCase()) {
            return true;
        }
        return false;
    }
    return false;
}
