// quickBarter: automatyczne potwierdzanie wymiany w barterze

{
    const _barter = window.barter;
    window.barter = function() {
        const res = new _barter();
        res.askAlert = function(data) {
            const id = data.id;
            const items = Object.keys(this.selectedItems).join();
            _g("barter&id=" + this.barterId + "&offerId=" + id + "&selectedItems=" + items + "&action=use&usesCount=1&available=0&desiredItem=" + this.desireItemId);
        }
        return res;
    }
}
