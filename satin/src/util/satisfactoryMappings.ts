import { clamp } from "lodash";

const MAP_BOUNDS = [
    {
        x: -3246,
        y: -3750,
    },
    {
        x: 4253,
        y: 3750,
    },
];

export const IMAGE_SIZE = { x: 5000, y: 5000 };

export function translateImageCoordinates({ x, y }: { x: number; y: number }): {
    x: number;
    y: number;
} {
    const clampedX = clamp(Math.abs(x), 0, IMAGE_SIZE.x);
    const clampedY = clamp(Math.abs(y), 0, IMAGE_SIZE.y);

    return {
        x: Math.round(
            (clampedX / IMAGE_SIZE.x) * (MAP_BOUNDS[1].x - MAP_BOUNDS[0].x) +
                MAP_BOUNDS[0].x
        ),
        y: Math.round(
            (clampedY / IMAGE_SIZE.y) * (MAP_BOUNDS[1].y - MAP_BOUNDS[0].y) +
                MAP_BOUNDS[0].y
        ),
    };
}
