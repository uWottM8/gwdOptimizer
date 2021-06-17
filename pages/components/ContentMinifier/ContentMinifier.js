import { useRef, useState } from "react";
// import { optimize } from 'svgo';
// import minifyier from 'html-minifier';
import ImagesFromHtmlParser from "../../utilities/ImagesFromHtmlParser/ImagesFromHtmlParser";
import styles from "./ContentMinifier.module.css";

const ContentMinifier = ({ primaryHtml, localHtml, minifyHandler }) => {
    const [minifierPanelVisibility, setMinifierPanelVisibility] =
        useState(false);
    // const [htmlMinified, setHtmlMinified] = useState(false);

    const minifierVisibilityToggleEvent = (event) => {
        setMinifierPanelVisibility(!minifierPanelVisibility);
    };

    const toggleHtmlMinifierEvent = (event) => {
        const checkBox = event.target;
        const isCheckBoxOn = checkBox.checked;
        if (isCheckBoxOn) {
            const newLocalHtml = removeSpaces(localHtml);
            // const newLocalHtml = minifyier.minify(localHtml);
            minifyHandler(newLocalHtml);
        } else {
            minifyHandler(primaryHtml);
        }
    };

    const toggleSvgMinifyEvent = (event) => {
        const checkBox = event.target;
        const isCheckBoxOn = checkBox.checked;
        if (!isCheckBoxOn) {
            minifyHandler(primaryHtml);
            return;
        }
        const svgImages = ImagesFromHtmlParser.parseSVG(primaryHtml);
        const optimizedSvgImages = svgImages.map((svg) => optimizeSvg(svg));
        console.log(optimizedSvgImages);
        const optimizedHtml = svgImages.reduce(
            (res, svg, i) => res.replace(svg, optimizedSvgImages[i]),
            localHtml
        ); //заменить на localHtml
        // const optimizedHtml = optimizeSvg(localHtml);
        minifyHandler(optimizedHtml);
    };

    const removeSpaces = (html) => {
        const stringsToReplace = [...html.matchAll(/[>;{}](\s*)/gims)]
            .map(([fullMatchStr, ...groups]) => groups)
            .flat();
        const htmlWithoutSpacers = stringsToReplace.reduce(
            (res, stringToReplace) => res.replace(stringToReplace, ""),
            html
        );
        return htmlWithoutSpacers;
    };

    const optimizeSvg = (svg) => {
        const { data } = optimize(svg, {
            cleanupAttrs: false,
            mergeStyles: false,
            inlineStyles: false,
            removeDoctype: false,
            removeXMLProcInst: false,
            removeComments: false,
            removeMetadata: false,
            removeTitle: false,
            removeDesc: false,
            removeUselessDefs: false,
            removeXMLNS: false,
            removeEditorsNSData: false,
            removeEmptyAttrs: false,
            removeHiddenElems: false,
            removeEmptyText: false,
            removeEmptyContainers: false,
            removeViewBox: false,
            cleanupEnableBackground: false,
            minifyStyles: false,
            convertStyleToAttrs: false,
            convertColors: false,
            convertPathData: false,
            convertTransform: false,
            removeUnknownsAndDefaults: false,
            removeNonInheritableGroupAttrs: false,
            removeUselessStrokeAndFill: false,
            removeUnusedNS: false,
            prefixIds: false,
            cleanupIDs: false,
            cleanupNumericValues: false,
            cleanupListOfValues: false,
            moveElemsAttrsToGroup: false,
            moveGroupAttrsToElems: false,
            collapseGroups: false,
            removeRasterImages: false,
            mergePaths: false,
            convertShapeToPath: false,
            convertEllipseToCircle: false,
            sortAttrs: false,
            sortDefsChildren: false,
            removeDimensions: false,
            removeAttrs: false,
            removeAttributesBySelector: false,
            removeElementsByAttr: false,
            addClassesToSVGElement: false,
            addAttributesToSVGElement: false,
            removeOffCanvasPaths: false,
            removeStyleElement: false,
            removeScriptElement: false,
            reusePaths: false,
        });
        return data;
    };

    return (
        <div className={styles.contentMinifier}>
            {minifierPanelVisibility ? (
                <>
                    <div className={styles.contentMinifier__controls}>
                        <span>
                            <input
                                type="checkbox"
                                id="minifyHtml"
                                onChange={toggleHtmlMinifierEvent}
                            />
                            <label htmlFor="minifyHtml">Удалить пробелы</label>
                        </span>
                        <span>
                            <input
                                type="checkbox"
                                id="minifySvg"
                                onChange={toggleSvgMinifyEvent}
                            />
                            <label htmlFor="minifySvg">
                                Минифицировать SVG
                            </label>
                        </span>
                    </div>
                    <div className={styles.contentMinifier__compression}>
                        <span
                            className={styles.contentMinifier__compressionLabel}
                        >
                            Cжатие:
                        </span>
                        <span className={styles.contentMinifier__compressionValue}>
                            {(
                                ((primaryHtml.length - localHtml.length) /
                                    primaryHtml.length) *
                                100
                            ).toFixed(1)}
                            %
                        </span>
                    </div>
                    <button onClick={minifierVisibilityToggleEvent}>
                        &times;
                    </button>
                </>
            ) : (
                <button onClick={minifierVisibilityToggleEvent}>
                    Минифицировать HTML
                </button>
            )}
        </div>
    );
};

export default ContentMinifier;
