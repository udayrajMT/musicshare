import { ColorType, colorToRGBA } from "../../types/ColorType"

export default (color: ColorType = [0.137, 0.137, 0.137, 1]) => ({
	"v": "4.5.7",
	"fr": 60,
	"ip": 0,
	"op": 120,
	"w": 400,
	"h": 300,
	"ddd": 0,
	"assets": [
		{
			"id": "comp_50",
			"layers": [
				{
					"ddd": 0,
					"ind": 0,
					"ty": 4,
					"nm": "Shape Layer 1",
					"ks": {
						"o": {
							"a": 0,
							"k": 100
						},
						"r": {
							"a": 0,
							"k": 0
						},
						"p": {
							"a": 0,
							"k": [
								200,
								150,
								0
							]
						},
						"a": {
							"a": 0,
							"k": [
								-5,
								4,
								0
							]
						},
						"s": {
							"a": 0,
							"k": [
								67.386,
								67.386,
								100
							]
						}
					},
					"ao": 1,
					"shapes": [
						{
							"ty": "gr",
							"it": [
								{
									"d": 1,
									"ty": "el",
									"s": {
										"a": 0,
										"k": [
											208.5,
											208.5
										]
									},
									"p": {
										"a": 0,
										"k": [
											0,
											0
										]
									},
									"nm": "Ellipse Path 1",
									"mn": "ADBE Vector Shape - Ellipse"
								},
								{
									"ty": "st",
									"c": {
										"a": 0,
										"k": colorToRGBA(color),
									},
									"o": {
										"a": 0,
										"k": 100
									},
									"w": {
										"a": 0,
										"k": 24
									},
									"lc": 1,
									"lj": 1,
									"ml": 4,
									"nm": "Stroke 1",
									"mn": "ADBE Vector Graphic - Stroke"
								},
								{
									"ty": "tr",
									"p": {
										"a": 0,
										"k": [
											-5.5,
											4
										],
										"ix": 2
									},
									"a": {
										"a": 0,
										"k": [
											0,
											0
										],
										"ix": 1
									},
									"s": {
										"a": 0,
										"k": [
											100,
											100
										],
										"ix": 3
									},
									"r": {
										"a": 0,
										"k": 0,
										"ix": 6
									},
									"o": {
										"a": 0,
										"k": 100,
										"ix": 7
									},
									"sk": {
										"a": 0,
										"k": 0,
										"ix": 4
									},
									"sa": {
										"a": 0,
										"k": 0,
										"ix": 5
									},
									"nm": "Transform"
								}
							],
							"nm": "Ellipse 1",
							"np": 3,
							"mn": "ADBE Vector Group"
						},
						{
							"ty": "tm",
							"s": {
								"a": 1,
								"k": [
									{
										"i": {
											"x": [
												0.336
											],
											"y": [
												0.99
											]
										},
										"o": {
											"x": [
												0.333
											],
											"y": [
												0
											]
										},
										"n": [
											"0p336_0p99_0p333_0"
										],
										"t": 20,
										"s": [
											0
										],
										"e": [
											100
										]
									},
									{
										"t": 80
									}
								],
								"ix": 1
							},
							"e": {
								"a": 1,
								"k": [
									{
										"i": {
											"x": [
												0.337
											],
											"y": [
												1
											]
										},
										"o": {
											"x": [
												0.333
											],
											"y": [
												0
											]
										},
										"n": [
											"0p337_1_0p333_0"
										],
										"t": 0,
										"s": [
											0
										],
										"e": [
											100
										]
									},
									{
										"t": 60
									}
								],
								"ix": 2
							},
							"o": {
								"a": 0,
								"k": 0,
								"ix": 3
							},
							"m": 1,
							"ix": 2,
							"nm": "Trim Paths 1",
							"mn": "ADBE Vector Filter - Trim"
						}
					],
					"ip": 0,
					"op": 240,
					"st": 0,
					"bm": 0,
					"sr": 1
				}
			]
		}
	],
	"layers": [
		{
			"ddd": 0,
			"ind": 0,
			"ty": 0,
			"nm": "Shape Layer 1 Comp 1",
			"refId": "comp_50",
			"ks": {
				"o": {
					"a": 0,
					"k": 100
				},
				"r": {
					"a": 1,
					"k": [
						{
							"i": {
								"x": [
									0.833
								],
								"y": [
									0.833
								]
							},
							"o": {
								"x": [
									0.167
								],
								"y": [
									0.167
								]
							},
							"n": [
								"0p833_0p833_0p167_0p167"
							],
							"t": 30,
							"s": [
								180
							],
							"e": [
								360
							]
						},
						{
							"t": 71
						}
					]
				},
				"p": {
					"a": 0,
					"k": [
						200,
						150,
						0
					]
				},
				"a": {
					"a": 0,
					"k": [
						200,
						150,
						0
					]
				},
				"s": {
					"a": 0,
					"k": [
						100,
						100,
						100
					]
				}
			},
			"ao": 0,
			"w": 400,
			"h": 300,
			"ip": 20,
			"op": 260,
			"st": 20,
			"bm": 0,
			"sr": 1
		},
		{
			"ddd": 0,
			"ind": 1,
			"ty": 0,
			"nm": "Shape Layer 1 Comp 1",
			"refId": "comp_50",
			"ks": {
				"o": {
					"a": 0,
					"k": 100
				},
				"r": {
					"a": 1,
					"k": [
						{
							"i": {
								"x": [
									0.833
								],
								"y": [
									0.833
								]
							},
							"o": {
								"x": [
									0.167
								],
								"y": [
									0.167
								]
							},
							"n": [
								"0p833_0p833_0p167_0p167"
							],
							"t": 19,
							"s": [
								0
							],
							"e": [
								180
							]
						},
						{
							"t": 59
						}
					]
				},
				"p": {
					"a": 0,
					"k": [
						200,
						150,
						0
					]
				},
				"a": {
					"a": 0,
					"k": [
						200,
						150,
						0
					]
				},
				"s": {
					"a": 0,
					"k": [
						100,
						100,
						100
					]
				}
			},
			"ao": 0,
			"w": 400,
			"h": 300,
			"ip": 0,
			"op": 59,
			"st": 0,
			"bm": 0,
			"sr": 1
		}
	]
})