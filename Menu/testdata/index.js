

export default {
    default: {
        "name": "root",
        "link_attributes": [],
        "children_attributes": [],
        "label_attributes": [],
        "attributes": [],
        "extras": [],
        "display": true,
        "display_children": true,
        "children": [
            {
                "name": "ApiDoc",
                "link_attributes": [],
                "children_attributes": [],
                "label_attributes": [],
                "uri": "#",
                "attributes": [],
                "extras": [],
                "display": true,
                "display_children": true,
                "children": [
                    {
                        "name": "Internal",
                        "link_attributes": [],
                        "children_attributes": [],
                        "label_attributes": [],
                        "uri": "/api/doc/evrinoma",
                        "attributes": [],
                        "extras": {
                            "routes": [
                                {
                                    "route": "app.swagger_ui.evrinoma",
                                    "parameters": []
                                }
                            ]
                        },
                        "display": true,
                        "display_children": true,
                        "children": []
                    }
                ]
            },
            {
                "name": "Logout",
                "link_attributes": [],
                "children_attributes": [],
                "label_attributes": [],
                "uri": "/logout",
                "attributes": {
                    "class": "logout"
                },
                "extras": {
                    "routes": [
                        {
                            "route": "fos_user_security_logout",
                            "parameters": []
                        }
                    ]
                },
                "display": true,
                "display_children": true,
                "children": []
            }
        ]
    },
    navigate: {
        "name": "root",
        "link_attributes": [],
        "children_attributes": [],
        "label_attributes": [],
        "attributes": [],
        "extras": [],
        "display": true,
        "display_children": true,
        "children": [
            {
                "icon": "monitor-star",
                "name": 'Objects 1', // подпись к иконке в навигационной панели
                "link_attributes": [],
                "children_attributes": [],
                "label_attributes": [],
                "uri": '#', // если указан , то данные будут запрашиваться по этому url
                "attributes": {
                    "class": "objects"
                }, // иконки из Material Design - https://materialdesignicons.com/
                "extras": [],
                "display": true,
                "display_children": true,
                "children": []
            },
            {
                "icon": "home",
                "name": 'Objects 2', // подпись к иконке в навигационной панели
                "link_attributes": [],
                "children_attributes": [],
                "label_attributes": [],
                "uri": '', // если указан , то данные будут запрашиваться по этому url
                "attributes": {
                    "class": "objects"
                }, // иконки из Material Design - https://materialdesignicons.com/
                "extras": [],
                "display": true,
                "display_children": true,
                "children": [
                    {
                        "icon": "folder",
                        "name": 'Folders', // подпись к иконке в навигационной панели
                        "link_attributes": [],
                        "children_attributes": [],
                        "label_attributes": [],
                        "uri": '', // если указан , то данные будут запрашиваться по этому url
                        "attributes": {
                            "class": "folder"
                        }, // иконки из Material Design - https://materialdesignicons.com/
                        "extras": [],
                        "display": true,
                        "display_children": true,
                        "children": []
                    },
                    {
                        "icon": "account-multiple-outline",
                        "name": 'Peoples', // подпись к иконке в навигационной панели
                        "link_attributes": [],
                        "children_attributes": [],
                        "label_attributes": [],
                        "uri": '', // если указан , то данные будут запрашиваться по этому url
                        "attributes": {
                            "class": "peoples"
                        }, // иконки из Material Design - https://materialdesignicons.com/
                        "extras": [],
                        "display": true,
                        "display_children": true,
                        "children": [
                            {
                                "icon": "star",
                                "name": 'Stars-54', // подпись к иконке в навигационной панели
                                "link_attributes": [],
                                "children_attributes": [],
                                "label_attributes": [],
                                "uri": '', // если указан , то данные будут запрашиваться по этому url
                                "attributes": {
                                    "class": "stars"
                                }, // иконки из Material Design - https://materialdesignicons.com/
                                "extras": [],
                                "display": true,
                                "display_children": true,
                                "children": [
                                    {
                                        "icon": "death-star",
                                        "name": 'Planet-555', // подпись к иконке в навигационной панели
                                        "link_attributes": [],
                                        "children_attributes": [],
                                        "label_attributes": [],
                                        "uri": '', // если указан , то данные будут запрашиваться по этому url
                                        "attributes": {
                                            "class": "stars",
                                            "events": ["event1"]
                                        }, // иконки из Material Design - https://materialdesignicons.com/
                                        "extras": [],
                                        "display": true,
                                        "display_children": true,
                                        "children": []
                                    },
                                    {
                                        "icon": "death-star",
                                        "name": 'Planet-777', // подпись к иконке в навигационной панели
                                        "link_attributes": [],
                                        "children_attributes": [],
                                        "label_attributes": [],
                                        "uri": '', // если указан , то данные будут запрашиваться по этому url
                                        "attributes": {
                                            "class": "stars",
                                            "events": ["event1", "event2"]
                                        }, // иконки из Material Design - https://materialdesignicons.com/
                                        "extras": [],
                                        "display": true,
                                        "display_children": true,
                                        "children": []
                                    },
                                    {
                                        "icon": "death-star",
                                        "name": 'Planet-888', // подпись к иконке в навигационной панели
                                        "link_attributes": [],
                                        "children_attributes": [],
                                        "label_attributes": [],
                                        "uri": '', // если указан , то данные будут запрашиваться по этому url
                                        "attributes": {
                                            "class": "stars",
                                            "events": ["event1", "event2", "eventAAA"]
                                        }, // иконки из Material Design - https://materialdesignicons.com/
                                        "extras": [],
                                        "display": true,
                                        "display_children": true,
                                        "children": []
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        "icon": "hexagram",
                        "name": 'Stars', // подпись к иконке в навигационной панели
                        "link_attributes": [],
                        "children_attributes": [],
                        "label_attributes": [],
                        "uri": '/', // если указан , то данные будут запрашиваться по этому url
                        "attributes": {
                            "class": "stars"
                        }, // иконки из Material Design - https://materialdesignicons.com/
                        "extras": [],
                        "display": true,
                        "display_children": true,
                        "children": []
                    },
                ]
            }
        ]
    }
};
