// The CRAFT headline for the Impact section: SVG markup plus the script that plays it.
//
// Choreography: the R draws first; the C closes into a solid disc that shoots a Polaroid
// out on a slant (spinning twice) and pockets it again; then A, F and the T — first as a +
// level with the F's middle arm — snap in, the R leaning into italic until the T is done,
// three stars pop out of the F and pop away above the T, the + turns into the T (no cellphone now),
// and the sunglasses drop onto the A last.
//
// Rule: assets never change size and never fade. They are only ever hidden by a letter
// (the masks), by the edge of the headline area (overflow: hidden), or gone in a burst.
// Every id is prefixed "ic-" so the defs cannot collide with anything else on the page.

const CRAFT_SVG_RAW = "<defs>\n<filter id=\"ic-stk-cut\" x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\" color-interpolation-filters=\"sRGB\">\n<feMorphology in=\"SourceAlpha\" operator=\"dilate\" radius=\"4.5\" result=\"grow\" />\n<feFlood flood-color=\"#ffffff\" /><feComposite in2=\"grow\" operator=\"in\" result=\"cut\" />\n<feOffset in=\"grow\" dx=\"0\" dy=\"3\" result=\"drop\" /><feGaussianBlur in=\"drop\" stdDeviation=\"2.4\" result=\"dropb\" />\n<feFlood flood-color=\"#151412\" flood-opacity=\".22\" /><feComposite in2=\"dropb\" operator=\"in\" result=\"shadow\" />\n<feMerge><feMergeNode in=\"shadow\" /><feMergeNode in=\"cut\" /><feMergeNode in=\"SourceGraphic\" /></feMerge>\n</filter>\n<pattern id=\"ic-dots\" width=\"6\" height=\"6\" patternUnits=\"userSpaceOnUse\"><circle cx=\"3\" cy=\"3\" r=\"1.25\" fill=\"#151412\" opacity=\".2\" /></pattern>\n<linearGradient id=\"ic-lens-fade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#111111\" stop-opacity=\".96\" /><stop offset=\".55\" stop-color=\"#111111\" stop-opacity=\".72\" /><stop offset=\"1\" stop-color=\"#111111\" stop-opacity=\".22\" /></linearGradient>\n<linearGradient id=\"ic-sunset\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ef4a2f\" /><stop offset=\".55\" stop-color=\"#f58a2a\" /><stop offset=\"1\" stop-color=\"#f5c518\" /></linearGradient>\n<clipPath id=\"ic-capline\"><rect x=\"-200\" y=\"-70\" width=\"800\" height=\"70\" /></clipPath>\n<mask id=\"ic-c-pocket\" maskUnits=\"userSpaceOnUse\" x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\">\n<rect x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\" fill=\"#fff\" /><circle id=\"ic-c-pocket-disc\" cx=\"35\" cy=\"-35\" r=\"35\" fill=\"#000\" />\n</mask>\n<mask id=\"ic-f-pocket\" maskUnits=\"userSpaceOnUse\" x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\">\n<rect x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\" fill=\"#fff\" /><rect x=\"222\" y=\"-70\" width=\"52\" height=\"400\" fill=\"#000\" />\n</mask>\n</defs>\n<g class=\"ink\" clip-path=\"url(#ic-capline)\">\n<g class=\"lt\" data-ch=\"C\">\n<path class=\"draw\" id=\"ic-c-arc\" pathLength=\"1\" d=\"M57.2 -53.6 A29 29 0 1 0 57.2 -16.4\" style=\"--d: 380ms; --dur: 320ms\" />\n</g>\n<g class=\"lt\" data-ch=\"R\">\n<path class=\"rise\" d=\"M86 -64 L86 -6\" style=\"transform-origin: 86px 0px; --d: 0ms; --dur: 220ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M86 -64 L108 -64 A17 17 0 0 1 108 -30 L86 -30\" style=\"--d: 120ms; --dur: 200ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M106 -27 L131 5\" style=\"--d: 220ms; --dur: 180ms\" />\n</g>\n<g class=\"lt join\" style=\"--jx: 60px; --dj: 3970ms\" data-ch=\"A\">\n<path class=\"draw\" pathLength=\"1\" d=\"M150 4 L178 -67.5 L206 4\" style=\"--d: 3990ms; --dur: 280ms\" />\n</g>\n<g class=\"lt join\" style=\"--jx: 110px; --dj: 4030ms\" data-ch=\"F\">\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -64 L230 -6\" style=\"--d: 4050ms; --dur: 200ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -64 L266 -64\" style=\"--d: 4150ms; --dur: 160ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -36 L258 -36\" style=\"--d: 4190ms; --dur: 160ms\" />\n</g>\n<g class=\"lt\" data-ch=\"T\">\n<path class=\"tt\" id=\"ic-t-stem\" pathLength=\"1\" d=\"M322 -64 L322 -6\" />\n<path class=\"tt\" id=\"ic-t-bar\" pathLength=\"1\" d=\"M348 -64 L296 -64\" />\n</g>\n</g>\n<circle class=\"c-ring\" id=\"ic-c-ring\" cx=\"35\" cy=\"-35\" r=\"29\" pathLength=\"360\" />\n<g class=\"shades\" id=\"ic-shades\" transform=\"translate(178 -70)\"><g class=\"lens-px\"><clipPath id=\"ic-lens-l\"><path d=\"M -23.03 1.41 L -5.17 1.41 L -6.58 10.81 C -7.28 14.10 -9.40 15.51 -12.22 15.51 L -17.86 15.51 C -21.15 15.51 -23.03 13.63 -23.26 10.81 Z\" /></clipPath><g clip-path=\"url(#ic-lens-l)\" fill=\"#111111\" shape-rendering=\"crispEdges\"><rect x=\"-24.26\" y=\"0.41\" width=\"20.09\" height=\"5.20\" /><rect x=\"-24.26\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"-23.16\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-18.76\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-14.36\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-9.96\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-5.56\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"-20.96\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-16.56\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-12.16\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-7.76\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"-24.26\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-22.06\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-19.86\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-17.66\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-15.46\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-13.26\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-11.06\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-8.86\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-6.66\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"-4.46\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /></g><clipPath id=\"ic-lens-r\"><path d=\"M 23.03 1.41 L 5.17 1.41 L 6.58 10.81 C 7.28 14.10 9.40 15.51 12.22 15.51 L 17.86 15.51 C 21.15 15.51 23.03 13.63 23.26 10.81 Z\" /></clipPath><g clip-path=\"url(#ic-lens-r)\" fill=\"#111111\" shape-rendering=\"crispEdges\"><rect x=\"4.17\" y=\"0.41\" width=\"20.09\" height=\"5.20\" /><rect x=\"4.17\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"5.56\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"6.66\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"7.76\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"8.86\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"9.96\" width=\"1.16\" height=\"1.16\" /><rect x=\"5.27\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"9.67\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"14.07\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"18.47\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"22.87\" y=\"11.06\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"12.16\" width=\"1.16\" height=\"1.16\" /><rect x=\"7.47\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"11.87\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"16.27\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"20.67\" y=\"13.26\" width=\"1.16\" height=\"1.16\" /><rect x=\"4.17\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"6.37\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"8.57\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"10.77\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"12.97\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"15.17\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"17.37\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"19.57\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"21.77\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /><rect x=\"23.97\" y=\"14.36\" width=\"1.16\" height=\"1.16\" /></g></g>\n<path d=\"M -28.20 -0.47 L -30.08 0.94 M 28.20 -0.47 L 30.08 0.94\" fill=\"none\" stroke=\"#111111\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n<path d=\"M -27.26 0.47 C -27.26 -1.41 -25.85 -2.35 -23.97 -2.35 L -3.76 -2.35 C -1.88 -2.35 -0.94 -0.94 -1.41 0.94 L -3.29 11.28 C -4.23 15.98 -7.52 18.33 -11.75 18.33 L -18.33 18.33 C -23.03 18.33 -25.85 15.51 -26.32 11.28 Z M -23.03 1.41 L -5.17 1.41 L -6.58 10.81 C -7.28 14.10 -9.40 15.51 -12.22 15.51 L -17.86 15.51 C -21.15 15.51 -23.03 13.63 -23.26 10.81 Z\" fill=\"#111111\" fill-rule=\"evenodd\" />\n<path d=\"M 27.26 0.47 C 27.26 -1.41 25.85 -2.35 23.97 -2.35 L 3.76 -2.35 C 1.88 -2.35 0.94 -0.94 1.41 0.94 L 3.29 11.28 C 4.23 15.98 7.52 18.33 11.75 18.33 L 18.33 18.33 C 23.03 18.33 25.85 15.51 26.32 11.28 Z M 23.03 1.41 L 5.17 1.41 L 6.58 10.81 C 7.28 14.10 9.40 15.51 12.22 15.51 L 17.86 15.51 C 21.15 15.51 23.03 13.63 23.26 10.81 Z\" fill=\"#111111\" fill-rule=\"evenodd\" />\n\n\n<path d=\"M -2.82 1.41 Q 0.00 -1.88 2.82 1.41\" fill=\"none\" stroke=\"#111111\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n</g>\n<g mask=\"url(#ic-c-pocket)\">\n<g class=\"asset\" id=\"ic-pola\" transform=\"translate(35 -35) rotate(-30) scale(0.43) translate(-43 -50)\">\n<g filter=\"url(#ic-stk-cut)\">\n<rect x=\"0\" y=\"0\" width=\"86\" height=\"100\" rx=\"2\" fill=\"#fffdf7\" />\n<clipPath id=\"ic-pol-photo\"><rect x=\"8\" y=\"8\" width=\"70\" height=\"64\" /></clipPath>\n<rect x=\"8\" y=\"8\" width=\"70\" height=\"64\" fill=\"#ebe4d8\" />\n<image href=\"/impact/phase-2.jpg\" x=\"-22\" y=\"-18.5\" width=\"130\" height=\"162.5\" preserveAspectRatio=\"xMidYMid slice\" clip-path=\"url(#ic-pol-photo)\" />\n<path d=\"M14 86 C22 80 28 90 36 84 S50 82 56 86\" fill=\"none\" stroke=\"#9b958a\" stroke-width=\"1.6\" stroke-linecap=\"round\" />\n</g>\n</g>\n</g>\n<circle class=\"c-glint\" id=\"ic-c-glint\" cx=\"35\" cy=\"-35\" r=\"6\" />\n<g mask=\"url(#ic-f-pocket)\">\n<g class=\"asset star\" id=\"ic-star-a\" transform=\"translate(332 -112) rotate(6) scale(0.5) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#ef4a2f\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n<g class=\"asset star\" id=\"ic-star-b\" transform=\"translate(302 -132) rotate(-10) scale(0.36) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#f5c518\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n<g class=\"asset star\" id=\"ic-star-c\" transform=\"translate(358 -140) rotate(14) scale(0.26) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#2fb4d9\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n</g>\n"
// The lenses' pixel dither is ~120 little squares a lens. As separate <rect>s they made the word 344
// elements, and Safari re-laid out every one of them whenever anything else on the page moved (the
// photos shrinking below cost a frame in two). Each lens's squares are drawn as one path instead:
// the same pixels, one element.
function mergeLensRects(svg: string) {
  return svg.replace(/(<g clip-path="url\(#ic-lens-[lr]\)" fill="#111111" shape-rendering="crispEdges">)((?:<rect [^>]*\/>)+)(<\/g>)/g, (_, open: string, rects: string, close: string) => {
    const d = [...rects.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)" \/>/g)]
      .map(([, x, y, w, h]) => `M${x} ${y}h${w}v${h}h-${w}z`).join('')
    return `${open}<path d="${d}" />${close}`
  })
}
export const CRAFT_SVG = mergeLensRects(CRAFT_SVG_RAW)

const clamp = (x: number) => Math.min(1, Math.max(0, x))
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const out = (x: number) => 1 - Math.pow(1 - x, 3)
const inn = (x: number) => x * x * x
const mix = (a: number, b: number, x: number) => a + (b - a) * x
const bez = (a: number, b: number, c: number, u: number) => (1 - u) * (1 - u) * a + 2 * u * (1 - u) * b + u * u * c

// Easing follows what each thing is doing: arriving → out, leaving or falling → in, travelling → in-out.
const TL = {
  // The C sends the reference shots round the word (his asks, 2026-10-03): the lollipop peeks out and
  // goes to stand in front of the A; the shots shoot out of the C one after another and circle the
  // word on a flat ring; everything holds still for a moment; then the ring carries on and each shot
  // goes back into the C where it came out, in the order they left, the lollipop among them in its
  // place on the ring (his ask, 2026-10-03). The C takes 1.6 s longer than it used to, so all
  // that follows it starts that much later.
  c: { close: [700, 840], fill: [840, 980], peek: [980, 1200], swell: [1200, 1340], flash: [1200, 1380], out: [1340, 1880], shrink: [3670, 3810], unfill: [3810, 3950], open: [3890, 4050] },
  // the shots: one after another out of the C, round the ring, through 1.2 s of slow motion (the
  // freeze: the ring brakes hard to a crawl and ramps back up; the lollipop held face on for over
  // 0.75 s, his ask),
  // then on round and back in through the same place, in the order they left
  shots: { freeze: [1880, 3080], slow: 0.03, speed: 10.5 / 1000, shoot: 150, inFor: 130 },
  tee: { stem: [4110, 4270], bar: [4170, 4370], morph: [4990, 5270] },
  // the R turns neon blue, leans into italic while the A and F come in, and holds there until the T
  // is finished (the + becomes the T by 5270, as the glasses start to drop)
  rItalic: { blue: [3950, 4090], lean: [4090, 4270], back: [5270, 5450] },
  stars: { pop: [4390, 4910], gap: 90, burst: 5050, burstGap: 70 },
  shades: { drop: [5270, 5550], swing: [5550, 5950] },
} as const
export const CRAFT_END = 5990
/** the sunglasses catch on the A's tip */
export const CRAFT_LAND = TL.shades.drop[1]
export const CRAFT_SETTLE = 5970

type Span = readonly [number, number]
const sg = (t: number, s: Span) => seg(t, s[0], s[1])

/** Swaps the stickers' die-cut SVG filter (#ic-stk-cut: a 4.5-unit white dilate plus a soft drop
 *  shadow) for the same look drawn as plain shapes: each sticker's own shapes again underneath, in
 *  white with a 9-unit outline (the border), and three faint dark copies a little wider and 3 units
 *  lower (the shadow, stepped so it reads soft). Safari renders SVG filters on the CPU and ran them
 *  every frame the stickers moved, which took CRAFT from 120 to ~40fps; shapes cost nothing extra.
 *  Runs once per headline; safe to call again. */
export function bakeStickers(svg: SVGSVGElement) {
  const NS = 'http://www.w3.org/2000/svg'
  const groups = Array.from(svg.querySelectorAll<SVGGElement>('g[filter="url(#ic-stk-cut)"]'))
  for (const g of groups) {
    const parts = Array.from(g.children).filter((el) => !['clipPath', 'defs', 'title'].includes(el.tagName))
    // one silhouette: every shape as a plain fill with an outline `grow` units wide on each side
    const silhouette = (colour: string, grow: number, opacity: number, dy: number) => {
      const layer = document.createElementNS(NS, 'g')
      layer.setAttribute('opacity', String(opacity))
      if (dy) layer.setAttribute('transform', `translate(0 ${dy})`)
      for (const el of parts) {
        let c: Element
        if (el.tagName === 'image') {
          // a photo's silhouette is its box
          c = document.createElementNS(NS, 'rect')
          for (const a of ['x', 'y', 'width', 'height']) c.setAttribute(a, el.getAttribute(a) ?? '0')
          const clip = el.getAttribute('clip-path')
          if (clip) c.setAttribute('clip-path', clip)
        } else {
          c = el.cloneNode(false) as Element
          c.removeAttribute('id')
        }
        const sw = parseFloat(el.getAttribute('stroke-width') ?? '0') || 0
        const filled = el.tagName === 'image' || (el.getAttribute('fill') ?? '') !== 'none'
        c.setAttribute('fill', filled ? colour : 'none')
        c.setAttribute('stroke', colour)
        c.setAttribute('stroke-width', String(sw + grow * 2))
        c.setAttribute('stroke-linejoin', 'round')
        c.setAttribute('stroke-linecap', 'round')
        layer.appendChild(c)
      }
      return layer
    }
    const under = [
      silhouette('#151412', 6.5, 0.06, 3),
      silhouette('#151412', 5.5, 0.07, 3),
      silhouette('#151412', 4.5, 0.1, 3),
      silhouette('#ffffff', 4.5, 1, 0),
    ]
    g.removeAttribute('filter')
    g.prepend(...under)
  }
}

// The C's reference shots (his asks, 2026-10-03): eight animals and places, no people, sent round the
// word on a flat ring behind the lollipop photo and back into the C (see playCraft).
const C_SHOTS = ['dog', 'ocean', 'fox', 'horse', 'lake', 'cat', 'desert', 'bird']

/** Adds the reference shots: copies of the lollipop's polaroid (so they share its die-cut border),
 *  each with its own photo, hidden until playCraft moves them. Also a layer under the letters, masked
 *  by the same C pocket, for the shots passing behind the word. Warms the photos so they are in hand
 *  by the time the C throws them. Call after bakeStickers; safe to call again. */
export function addCTrail(svg: SVGSVGElement) {
  const pola = svg.querySelector<SVGGElement>('#ic-pola')
  const front = pola?.parentNode as SVGGElement | null
  const ink = svg.querySelector('.ink')
  if (!pola || !front || !ink || svg.querySelector('.c-trail')) return
  const back = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  back.setAttribute('mask', 'url(#ic-c-pocket)')
  back.setAttribute('class', 'c-behind')
  svg.insertBefore(back, ink)
  C_SHOTS.forEach((name, i) => {
    const g = pola.cloneNode(true) as SVGGElement
    g.removeAttribute('id')
    // the copies use the lollipop's own photo clip rather than repeating its id
    g.querySelectorAll('clipPath').forEach((c) => c.remove())
    g.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    const img = g.querySelector('image')
    if (img) {
      img.setAttribute('href', `/impact/trail/${name}.webp`)
      img.setAttribute('x', '8'); img.setAttribute('y', '8'); img.setAttribute('width', '70'); img.setAttribute('height', '64')
      img.setAttribute('preserveAspectRatio', 'xMidYMid slice')
    }
    g.classList.add('c-trail')
    g.dataset.i = String(i)
    g.style.visibility = 'hidden'; g.style.display = 'none'
    front.insertBefore(g, pola)
  })
  // Each polaroid's back, for when it is round the far side of the ring facing away (his asks,
  // 2026-10-03): white paper, with only a faint wash of the photo's colours showing through where the
  // photo is, mirrored as it would be from behind and too soft to make out. The wash is the photo
  // shrunk to 8 x 7 pixels and stretched, not a blur filter, which Safari would redraw every frame.
  const cards: [SVGGElement, string][] = [[pola, 'lollipop'], ...Array.from(svg.querySelectorAll<SVGGElement>('.c-trail')).map((g) => [g, C_SHOTS[+(g.dataset.i ?? 0)]] as [SVGGElement, string])]
  for (const [g, name] of cards) {
    const card = g.firstElementChild
    if (!card || card.querySelector('.c-backface')) continue
    const NS = 'http://www.w3.org/2000/svg'
    const set = (el: Element, attrs: Record<string, string>) => { for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); return el }
    const backface = set(document.createElementNS(NS, 'g'), { class: 'c-backface' }) as SVGGElement
    backface.style.display = 'none'
    backface.appendChild(set(document.createElementNS(NS, 'rect'), { x: '0', y: '0', width: '86', height: '100', rx: '2', fill: '#ffffff' }))
    backface.appendChild(set(document.createElementNS(NS, 'image'), {
      href: `/impact/trail/${name}-leak.webp`, x: '8', y: '8', width: '70', height: '64',
      preserveAspectRatio: 'none', opacity: '0.16', transform: 'translate(86 0) scale(-1 1)',
    }))
    card.appendChild(backface)
  }
  for (const n of C_SHOTS) for (const f of [n, `${n}-leak`]) { const im = new Image(); im.src = `/impact/trail/${f}.webp` }
  { const im = new Image(); im.src = '/impact/trail/lollipop-leak.webp' }
}

/** Puts every part in its finished place (also the reduced-motion / no-JS picture). */
export function restCraft(wrap: HTMLElement) {
  const q = (id: string) => wrap.querySelector<SVGGraphicsElement>('#ic-' + id)
  const rest = wrap.querySelector('.lt[data-ch="R"]') // the R stands upright, in ink, at rest
  rest?.removeAttribute('transform'); rest?.querySelectorAll<SVGPathElement>('path').forEach((p) => p.style.removeProperty('stroke'))
  wrap.querySelectorAll<SVGGElement>('.c-trail').forEach((g) => { g.style.visibility = 'hidden'; g.style.display = 'none' })
  for (const id of ['pola', 'c-glint', 'c-ring', 'star-a', 'star-b', 'star-c']) {
    const el = q(id)
    el?.style.setProperty('visibility', 'hidden')
    // hidden stickers also leave rendering (see show() in playCraft)
    if (el?.classList.contains('asset')) el.style.setProperty('display', 'none')
  }
  q('c-pocket-disc')?.setAttribute('r', '35')
  const arc = q('c-arc')
  if (arc) arc.style.visibility = ''
  const shades = q('shades')
  if (shades) { shades.style.visibility = ''; shades.setAttribute('transform', 'translate(178 -70)') }
  const stem = q('t-stem'), bar = q('t-bar')
  stem?.setAttribute('d', 'M322 -64 L322 -6'); bar?.setAttribute('d', 'M348 -64 L296 -64')
  for (const el of [stem, bar]) if (el) { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; el.style.visibility = '' }
}

/** Once the word has settled, the shades stay balanced on the A's tip: each scroll knocks them
 *  into a tilt about the tip, and a damped spring rocks them back to level. Returns a cleanup. */
export function balanceShades(wrap: HTMLElement): () => void {
  const shades = wrap.querySelector<SVGGElement>('#ic-shades')
  if (!shades) return () => {}
  let a = 0, v = 0, raf = 0, last = 0, lastY = window.scrollY
  const draw = () => shades.setAttribute('transform', `translate(178 -70) rotate(${a.toFixed(2)})`)
  const step = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    v += (-90 * a - 6 * v) * dt
    a = Math.max(-22, Math.min(22, a + v * dt))
    draw()
    if (Math.abs(a) > 0.05 || Math.abs(v) > 0.5) raf = requestAnimationFrame(step)
    else { a = v = 0; draw(); raf = 0 }
  }
  const onScroll = () => {
    const y = window.scrollY, dy = y - lastY
    lastY = y
    v += Math.max(-40, Math.min(40, dy)) * 3.5
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(step) }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); a = 0; draw() }
}

/** Plays the headline once. Returns a cleanup that stops it and leaves the finished word. */
export function playCraft(wrap: HTMLElement, svg: SVGSVGElement, onSettled: () => void): () => void {
  const q = (id: string) => wrap.querySelector('#ic-' + id) as SVGGraphicsElement
  // hidden stickers also leave rendering: Firefox and Safari otherwise run the die-cut filter on them every repaint
  const show = (el: SVGElement, on: boolean, render = on) => {
    el.style.visibility = on ? 'visible' : 'hidden'
    if (el.classList.contains('asset')) el.style.display = render ? '' : 'none'
  }
  const place = (el: Element, x: number, y: number, r: number, s: number, ox: number, oy: number) =>
    el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)})${s === 1 ? '' : ` scale(${s})`} translate(${-ox} ${-oy})`)

  // the screen's top edge in word units — the sunglasses arrive from outside across it
  const inv = svg.getScreenCTM()?.inverse()
  const TOP = inv ? new DOMPoint(0, 0).matrixTransform(inv).y : -260

  // ── C: closes into a disc that shoots the photo out on a slant and pockets it again ──
  const cArc = q('c-arc'), cRing = q('c-ring'), glint = q('c-glint'), pocketDisc = q('c-pocket-disc'), pola = q('pola')
  // ── the reference shots and the lollipop ──
  const shots = Array.from(wrap.querySelectorAll<SVGGElement>('.c-trail'))
  const behind = svg.querySelector<SVGGElement>('.c-behind')
  const frontLayer = pola.parentNode as SVGGElement
  const N = shots.length, SH = TL.shots, C0: [number, number] = [35, -35]
  // The ring: flat, round the whole word, as wide as the screen allows (on a phone the word fills the
  // width, so the ring keeps to the screen's edges with room for a photo).
  const scr = (() => {
    const m = svg.getScreenCTM()?.inverse()
    if (!m) return [-60, 420]
    return [new DOMPoint(0, 0).matrixTransform(m).x, new DOMPoint(window.innerWidth, 0).matrixTransform(m).x]
  })()
  // Seen nearly edge-on and at the letters' own height, like a planet's ring: the near side crosses in
  // front of the letters, the far side passes behind them (his ask, 2026-10-03).
  const RCX = 178, RCY = -32
  const RX = Math.max(150, Math.min(225, Math.min(RCX - scr[0], scr[1] - RCX) - 26)), RY = 20
  const ring = (a: number): [number, number] => [RCX + RX * Math.cos(a), RCY + RY * Math.sin(a)] // sin > 0: the near side
  // The doorway: one place on the ring, just behind the C. Every card leaves the C through it and
  // comes back in through it after exactly one turn of the ring (his ask, 2026-10-03). The ring turns
  // so the far side runs left to right and the near side right to left: a card goes out behind the
  // word, round its far end, and comes along the front.
  const GATE = Math.PI + 0.45, G = ring(GATE), TWO_PI = Math.PI * 2
  const W = SH.speed // radians per ms
  // the ring's own direction of travel at the doorway, to throw a card out along and bring it back in on
  const vel: [number, number] = [-RX * Math.sin(GATE), RY * Math.cos(GATE)]
  const vn = Math.hypot(vel[0], vel[1]), dir: [number, number] = [vel[0] / vn, vel[1] / vn]
  const OUT_CTRL: [number, number] = [G[0] - dir[0] * 40, G[1] - dir[1] * 40] // swings out past the C and round into the ring
  const IN_CTRL: [number, number] = [G[0] + dir[0] * 30, G[1] + dir[1] * 30]  // runs on from the ring into the C
  // The lollipop leads: when time stops it is in the middle of the near side, in front of the A, and
  // the shots are strung out behind it round the far side, the last just out of the doorway.
  const L_REACH = Math.PI / 2 + TWO_PI - GATE             // doorway to the front of the A
  const gap = L_REACH / (N + 0.3)
  const reach = shots.map((_, i) => L_REACH - (i + 1) * gap) // shot 0 right behind the lollipop
  const joinAt = reach.map((r) => SH.freeze[0] - r / W)     // on the ring
  const leaveAt = joinAt.map((t) => t - SH.shoot)           // out of the C
  // Through the freeze time runs slow, not still (his asks, 2026-10-03): a speed ramp. The ring brakes
  // hard from full speed to a crawl (SH.slow of it), creeps, and ramps back up to full speed at the
  // end. ramp(p) is how far it has gone by p (0 to 1 of the freeze), in freeze-lengths at full speed.
  const SLOW_D = SH.freeze[1] - SH.freeze[0], BRAKE = 0.1, RAMP = 0.14
  const ramp = (p: number) => SH.slow * p
    + (1 - SH.slow) * (BRAKE / 3) * (1 - Math.pow(1 - Math.min(p, BRAKE) / BRAKE, 3))
    + (p > 1 - RAMP ? (1 - SH.slow) * (RAMP / 3) * Math.pow((p - 1 + RAMP) / RAMP, 3) : 0)
  const SLOW_GAIN = W * SLOW_D * ramp(1)
  const homeAt = reach.map((r) => SH.freeze[1] + (TWO_PI - r - SLOW_GAIN) / W) // round once, back at the doorway
  // how far round the ring a card has come by time t
  const travelled = (join: number, r: number, t: number) =>
    t < SH.freeze[0] ? (t - join) * W : t < SH.freeze[1] ? r + W * SLOW_D * ramp((t - SH.freeze[0]) / SLOW_D) : r + SLOW_GAIN + (t - SH.freeze[1]) * W
  const ringScale = (z: number) => 0.43 * (0.8 + 0.28 * (z + 1) / 2)
  function shotAt(i: number, t: number): [number, number, number, number, number] | null {
    if (t < leaveAt[i] || t >= homeAt[i] + SH.inFor) return null
    if (t < joinAt[i]) {
      // thrown out of the C, swinging round into the ring at the doorway
      const u = (t - leaveAt[i]) / SH.shoot, z = Math.sin(GATE)
      return [bez(C0[0], OUT_CTRL[0], G[0], u), bez(C0[1], OUT_CTRL[1], G[1], u), -4 + 8 * z, ringScale(z) * mix(0.55, 1, out(u)), z]
    }
    if (t < homeAt[i]) {
      const a = GATE + travelled(joinAt[i], reach[i], t), [x, y] = ring(a), z = Math.sin(a)
      return [x, y, -4 + 8 * z, ringScale(z), z]
    }
    // back at the doorway: on into the C, shrinking
    const u = (t - homeAt[i]) / SH.inFor, z = Math.sin(GATE)
    return [bez(G[0], IN_CTRL[0], C0[0], u), bez(G[1], IN_CTRL[1], C0[1], u), -4 + 8 * z, ringScale(z) * (1 - 0.6 * inOut(u)), z]
  }
  // A card on the ring faces out from the word: full width at the front, edge-on at the two ends, and
  // its back to the viewer round the far side.
  function turn(g: SVGGElement, x: number, y: number, rot: number, s: number, z: number, side = z) {
    const back = side < 0
    const face = g.firstElementChild?.querySelector<SVGGElement>('.c-backface')
    if (face && (face.style.display === 'none') === back) face.style.display = back ? '' : 'none'
    const sx = s * Math.max(0.08, Math.min(1, Math.abs(side) * 1.15))
    g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${sx.toFixed(4)} ${s.toFixed(4)}) translate(-43 -50)`)
  }
  // the lollipop's place on the ring, for the shots that pass it in the slow motion
  let lAngle = NaN
  function shotsAt(t: number) {
    const slowing = t >= SH.freeze[0] - 60 && t < SH.freeze[1] + 60
    shots.forEach((g, i) => {
      const st = shotAt(i, t)
      show(g, !!st)
      if (!st) return
      let [x, y, rot, s, z] = st
      // a shot going by the lollipop goes by just behind it (his ask): a little further off, and under it
      let passing = 0
      if (slowing && !Number.isNaN(lAngle) && t >= joinAt[i] && t < homeAt[i]) {
        const d = Math.abs(GATE + travelled(joinAt[i], reach[i], t) - lAngle)
        passing = d < 0.45 ? 0.5 + 0.5 * Math.cos((Math.PI * d) / 0.45) : 0
      }
      y -= 7 * passing; s *= 1 - 0.1 * passing
      const layer = z < 0 && behind ? behind : frontLayer
      if (g.parentNode !== layer || (layer === frontLayer && pola.parentNode === layer && pola.compareDocumentPosition(g) & Node.DOCUMENT_POSITION_FOLLOWING)) layer.insertBefore(g, pola.parentNode === layer ? pola : null)
      turn(g, x, y, rot, s, z)
    })
  }
  // The lollipop: peeks out of the C on its slant, back first, white (his ask, 2026-10-03), and is the
  // first thrown out through the doorway, leading the shots round. It rides back out (a third larger
  // than the shots, all the way, so no size change catches the eye), is at full speed in the middle of
  // the near side, in front of the A, when time stops, and there, alone, turns over to show its photo.
  // Then it leads on round and is the first home.
  const TILT = -30, PEEK: [number, number] = [C0[0] - 0.5 * 36, C0[1] - 0.866 * 36]
  const L_BIG = 1.3
  const lJoin = SH.freeze[0] - L_REACH / W
  const lHome = SH.freeze[1] + (TWO_PI - L_REACH - SLOW_GAIN) / W
  // In the slow motion the lollipop all but stops, in front of the A, and turns over; the shots behind it
  // drift on and the nearest go by just behind it; then it gathers itself and slips back past them,
  // leading again as the slow motion ends. Its progress through the freeze, 0 to 1 of the
  // ring's: slow at first, all at the end.
  // still until the last fifth, then gathering to the ring's own speed just as the ramp ends
  const lSlow = (p: number) => (p < 0.8 ? 0 : Math.pow((p - 0.8) / 0.2, 2))
  const lTravelled = (t: number) => t >= SH.freeze[0] && t < SH.freeze[1]
    ? L_REACH + SLOW_GAIN * lSlow((t - SH.freeze[0]) / SLOW_D)
    : travelled(lJoin, L_REACH, t)
  // thrown from rest: reaching the ring's own speed at the doorway takes twice as long as a steady run
  const throwLen = (() => { let len = 0, p = PEEK; for (let k = 1; k <= 20; k++) { const u = k / 20, q: [number, number] = [bez(PEEK[0], OUT_CTRL[0], G[0], u), bez(PEEK[1], OUT_CTRL[1], G[1], u)]; len += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q } return len })()
  const lThrow = lJoin - (2 * throwLen) / (vn * W)
  const lollipopIn = lHome + SH.inFor
  // the turn over, inside the hold: the photo is showing by the time the clock starts again
  const FLIP: [number, number] = [SH.freeze[0] + 20, SH.freeze[0] + 170]
  function lollipopAt(t: number): [number, number, number, number, number, number] {
    const C = TL.c
    if (t < lThrow) { const d = mix(0, 36, out(sg(t, C.peek))); return [C0[0] - 0.5 * d, C0[1] - 0.866 * d, TILT, 0.43, 1, -1] }
    if (t < lJoin) {
      const k = (t - lThrow) / (lJoin - lThrow), u = k * k, z = Math.sin(GATE) // from standing, faster and faster
      return [bez(PEEK[0], OUT_CTRL[0], G[0], u), bez(PEEK[1], OUT_CTRL[1], G[1], u), mix(TILT, -4 + 8 * z, k), mix(0.43, ringScale(z) * L_BIG, k), z, -Math.max(0.08, Math.abs(z))]
    }
    if (t < lHome) {
      const a = GATE + lTravelled(t), [x, y] = ring(a), z = Math.sin(a)
      lAngle = a
      const w = Math.max(0.08, Math.abs(z))
      // back out until the hold; turns over in it; its face out from then on, as the ring turns it
      const side = t < FLIP[0] ? -w : t < FLIP[1] ? -Math.cos(Math.PI * seg(t, FLIP[0], FLIP[1])) * w : z
      return [x, y, -4 + 8 * z, ringScale(z) * L_BIG, z, side]
    }
    const u = (t - lHome) / SH.inFor, z = Math.sin(GATE)
    return [bez(G[0], IN_CTRL[0], C0[0], u), bez(G[1], IN_CTRL[1], C0[1], u), -4 + 8 * z, ringScale(z) * L_BIG * (1 - 0.6 * inOut(u)), z, z]
  }

  function cAt(t: number) {
    const C = TL.c
    const ringOn = t >= C.close[0] && t < C.open[1]
    show(cRing, ringOn); cArc.style.visibility = ringOn ? 'hidden' : ''
    if (ringOn) {
      const L = t < C.unfill[0] ? mix(280, 360, inOut(sg(t, C.close))) : mix(360, 280, inOut(sg(t, C.open)))
      const f = t < C.unfill[0] ? inOut(sg(t, C.fill)) : 1 - inOut(sg(t, C.unfill))
      const k = 1 + 0.14 * (t < C.shrink[0] ? out(sg(t, C.swell)) : 1 - inOut(sg(t, C.shrink))) // swells to shoot the photo out
      cRing.setAttribute('r', mix(29, 17.5, f).toFixed(2)); cRing.style.strokeWidth = mix(12, 35, f).toFixed(2)
      cRing.style.strokeDasharray = L >= 359.9 ? 'none' : `${L.toFixed(2)} ${(360 - L).toFixed(2)}`
      cRing.style.strokeDashoffset = (-(180 - L / 2)).toFixed(2)
      cRing.setAttribute('transform', `translate(35 -35) scale(${k.toFixed(3)}) translate(-35 35)`)
      pocketDisc.setAttribute('r', (35 * k).toFixed(2))
    }
    const [lx, ly, lr, ls, lz, lside] = lollipopAt(t)
    show(pola, t >= C.peek[0] && t < lollipopIn)
    // behind the letters on the far side of the ring; on the near side on top of the shots, so in front
    // of the A it is the one seen whole
    const lLayer = lz < 0 && behind ? behind : frontLayer
    if (pola.parentNode !== lLayer) lLayer.appendChild(pola)
    turn(pola, lx, ly, lr, ls, lz, lside)
    shotsAt(t)
    const g = seg(t, C.flash[0], C.flash[0] + 200)
    show(glint, g > 0 && g < 1); glint.setAttribute('r', mix(4, 30, out(g)).toFixed(2))
  }

  // ── T: a + first (crossbar level with the F's middle arm, reaching further left), then the T ──
  const tStem = q('t-stem'), tBar = q('t-bar')
  const PLUS = { stem: [-53, -19], x1: 345, x2: 280, y: -36 }, TEE = { stem: [-64, -6], x1: 348, x2: 296, y: -64 }
  function teeAt(t: number) {
    const m = inOut(sg(t, TL.tee.morph))
    tStem.setAttribute('d', `M322 ${mix(PLUS.stem[0], TEE.stem[0], m).toFixed(2)} L322 ${mix(PLUS.stem[1], TEE.stem[1], m).toFixed(2)}`)
    const y = mix(PLUS.y, TEE.y, m)
    tBar.setAttribute('d', `M${mix(PLUS.x1, TEE.x1, m).toFixed(2)} ${y.toFixed(2)} L${mix(PLUS.x2, TEE.x2, m).toFixed(2)} ${y.toFixed(2)}`)
    for (const [el, span] of [[tStem, TL.tee.stem], [tBar, TL.tee.bar]] as const) {
      el.style.strokeDasharray = '1'; el.style.strokeDashoffset = (1 - inOut(sg(t, span))).toFixed(3)
      el.style.visibility = t < span[0] ? 'hidden' : ''
    }
  }

  // ── sunglasses: drop from the top edge, catch on the A's tip, swing to rest ──
  const shades = q('shades')
  function shadesAt(t: number) {
    const S = TL.shades
    if (t < S.drop[0]) { shades.style.visibility = 'hidden'; return }
    shades.style.visibility = ''
    const y = mix(TOP - 30, -70, inn(sg(t, S.drop)))
    const w = sg(t, S.swing), r = t < S.swing[0] ? 0 : 8 * Math.exp(-4 * w) * Math.sin(w * Math.PI * 3.2) * (1 - w)
    shades.setAttribute('transform', `translate(178 ${y.toFixed(2)}) rotate(${r.toFixed(2)})`)
  }

  // ── R: leans into italic, then back upright (his ask, 2026-10-01; this replaced the wave sticker).
  //    A skew about the baseline (y 0), so the foot stays put and the top leans right. ──
  //    While it leans it turns neon blue, and goes back to the ink as it straightens (his ask, same day).
  const rLetter = wrap.querySelector<SVGGElement>('.lt[data-ch="R"]')
  const rPaths = rLetter ? Array.from(rLetter.querySelectorAll<SVGPathElement>('path')) : []
  const R_SLANT = -12, NEON = [31, 81, 255] // #1f51ff
  const ink = (() => { const m = rPaths[0] && getComputedStyle(rPaths[0]).stroke.match(/\d+/g); return m ? m.slice(0, 3).map(Number) : [17, 17, 17] })()
  function rAt(t: number) {
    if (!rLetter) return
    const I = TL.rItalic
    const back = 1 - inOut(sg(t, I.back))
    const k = t < I.back[0] ? inOut(sg(t, I.lean)) : back          // the slant
    const kc = t < I.back[0] ? inOut(sg(t, I.blue)) : back         // the colour, a beat ahead of it
    if (k <= 0) rLetter.removeAttribute('transform')
    else rLetter.setAttribute('transform', `skewX(${(R_SLANT * k).toFixed(2)})`)
    if (kc <= 0) { rPaths.forEach((p) => p.style.removeProperty('stroke')); return }
    const c = `rgb(${ink.map((v, i) => Math.round(mix(v, NEON[i], kc))).join(',')})`
    rPaths.forEach((p) => { p.style.stroke = c })
  }

  // ── stars: pop up out of the F, curve right above the T, then pop away (the rays they used to burst
  //    into are gone, at his ask, 2026-10-01) ──
  // stars draw above the letters while they land
  const starLayer = q('star-a').parentElement
  if (starLayer) svg.appendChild(starLayer)
  const STARS = [
    { el: q('star-a'), s: 0.5, from: [248, -40], via: [244, -168], to: [332, -112], r: 6 },
    { el: q('star-b'), s: 0.36, from: [242, -36], via: [232, -190], to: [302, -132], r: -10 },
    { el: q('star-c'), s: 0.26, from: [254, -36], via: [262, -200], to: [358, -140], r: 14 },
  ].map((S, i) => ({ ...S, burstAt: TL.stars.burst + i * TL.stars.burstGap }))
  function starsAt(t: number) {
    // the three stars leave rendering only together: Safari clips a showing star's die-cut edge
    // while a sibling star is out of rendering
    const anyStar = STARS.some((S, i) => t >= TL.stars.pop[0] + i * TL.stars.gap && t < S.burstAt)
    STARS.forEach((S, i) => {
      const t0s = TL.stars.pop[0] + i * TL.stars.gap
      const u = out(seg(t, t0s, TL.stars.pop[1] + i * TL.stars.gap))
      show(S.el, t >= t0s && t < S.burstAt, anyStar)
      place(S.el, bez(S.from[0], S.via[0], S.to[0], u), bez(S.from[1], S.via[1], S.to[1], u), S.r - 200 * (1 - u), S.s, 48, 43)
    })
  }

  let raf = 0
  const t0 = performance.now()
  const frame = (now: number) => {
    const t = now - t0
    cAt(t); teeAt(t); shadesAt(t); rAt(t); starsAt(t)
    if (t < CRAFT_END) raf = requestAnimationFrame(frame)
    else restCraft(wrap)
  }
  frame(t0)
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(frame)
  const settle = window.setTimeout(onSettled, CRAFT_SETTLE)

  return () => {
    cancelAnimationFrame(raf)
    window.clearTimeout(settle)
    restCraft(wrap)
  }
}
