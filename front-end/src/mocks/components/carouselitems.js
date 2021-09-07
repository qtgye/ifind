export const slideWidth = 16;

export const _items = [
    {
        player: {
            title: 'Efren Reyes',
        },
    },
    {
        player: {
            title: "Ronnie O'Sullivan",
        },
    },
    {
        player: {
            title: 'Shane Van Boening',
        },
    },
    {
        player: {
            title: 'Mike Sigel',
        },
    },
    {
        player: {
            title: 'Mike Sigel',
        },
    },
    {
        player: {
            title: 'Mike Sigel',
        },
    },
    {
        player: {
            title: 'Willie Mosconi',
        },
    },
    {
        player: {
            title: 'Willie Mosconi',
        },
    },
    {
        player: {
            title: 'Willie Mosconi',
        },
    },
    {
        player: {
            title: 'Willie M',
        },
    },
];

export const length = _items.length;

_items.push(..._items);

export const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createItem = (position, idx) => {
    const item = {
        styles: {
            transform: `translateX(${position * slideWidth}rem)`,
        },
        player: _items[idx].player,
    };

    switch (position) {
        case length - 1:
        case length + 1:
            item.styles = { ...item.styles, filter: 'grayscale(1)' };
            break;
        case length:
            break;
        default:
            item.styles = { ...item.styles, opacity: 0 };
            break;
    }

    return item;
};

export const keys = Array.from(Array(_items.length).keys());