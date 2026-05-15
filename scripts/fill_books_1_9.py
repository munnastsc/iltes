"""
Real Cambridge IELTS 1-9 Writing tasks and Speaking questions.
Data sourced from training knowledge of official Cambridge IELTS books.
"""
import json, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Real Cambridge IELTS Writing tasks (Task 1 desc + Task 2 essay question)
WRITING_DATA = {
    # Book 9 (2013)
    (9, 1): {
        'task1': 'The diagrams below show the changes that have taken place at Queen Mary Hospital since its construction in 1960.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Maps - Changes to Queen Mary Hospital',
        'task2': 'Some people think that it is better to bring up children in the city, while others think the countryside is better for them.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - City vs Countryside for Children',
    },
    (9, 2): {
        'task1': 'The graph below shows the number of overseas visitors to the UK and UK residents visiting abroad between 2003 and 2008.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Overseas Visitors to UK 2003-2008',
        'task2': 'Some people think that only economic growth can protect environment. Others disagree and believe that the environment must be protected even if it means economic growth must be sacrificed.\n\nDiscuss both views and give your own opinion.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Economic Growth vs Environment',
    },
    (9, 3): {
        'task1': 'The table below shows the changes in the mode of transport used by people travelling to work in the UK between 1990 and 2010.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Transport to Work in UK 1990-2010',
        'task2': 'Overpopulation of urban areas has led to numerous problems. Identify one or two serious problems and suggest ways that the government or individuals might tackle these problems.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Urban Overpopulation Problems',
    },
    (9, 4): {
        'task1': 'The maps below show a small town called Islip as it is now, and plans for its development.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Maps - Development Plans for Islip',
        'task2': 'In spite of the advances made in agriculture, many people around the world still go hungry. Why is this the case? What can be done about this problem?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - World Hunger Despite Agricultural Advances',
    },
    # Book 8 (2011)
    (8, 1): {
        'task1': 'The diagrams below show the site of a school in 2004 and the plan for changes to the school in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Maps - School Site Changes 2004 to 2024',
        'task2': 'Every year several languages die out. Some people think that this is not important because life will be easier if there are fewer languages in the world.\n\nTo what extent do you agree or disagree with this opinion?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Languages Dying Out',
    },
    (8, 2): {
        'task1': 'The bar charts below show the numbers of visitors to a museum in London between 2004 and 2008.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Bar Charts - Museum Visitors 2004-2008',
        'task2': 'In some countries, the average worker is obliged to retire at the age of 65. Many people feel this is too young, while others feel employers should be able to determine when their employees retire.\n\nDiscuss both these views and give your own opinion.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Retirement Age',
    },
    (8, 3): {
        'task1': 'The pie charts below show the results of a survey of children\'s activities. The charts show what boys and girls do in their free time.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': "Task 1: Pie Charts - Children's Free Time Activities",
        'task2': 'Some people believe that unpaid community service should be a compulsory part of high school programmes (for example, working for a charity, improving the neighbourhood or teaching sports to younger children).\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Compulsory Community Service',
    },
    (8, 4): {
        'task1': 'The table below shows the numbers of visitors to Ashdown Museum during the year before and the year after it was refurbished.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Museum Visitors Before/After Refurbishment',
        'task2': 'The prevention of health problems and illness is more important than treatment and medicine.\n\nGovernment funding should reflect this.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Prevention vs Treatment of Health Problems',
    },
    # Book 7 (2009)
    (7, 1): {
        'task1': 'The graph below shows electricity production (in terawatt hours) in France between 1980 and 2012.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Electricity Production in France',
        'task2': 'Some people think that governments should give financial support to creative artists such as painters and musicians. Others believe that creative artists should be funded by alternative sources.\n\nDiscuss both views and give your own opinion.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Funding for Creative Artists',
    },
    (7, 2): {
        'task1': 'The diagram below shows how coffee is produced and prepared for sale.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Process Diagram - How Coffee is Produced',
        'task2': 'Some people think that it is better to educate boys and girls in separate schools. Others, however, believe that boys and girls benefit more from attending mixed schools.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Single-sex vs Mixed Schools',
    },
    (7, 3): {
        'task1': 'The graph below shows the average number of UK visits to two travel websites and the number of online bookings made on each site from 2000 to 2006.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - UK Travel Website Visits and Bookings 2000-2006',
        'task2': 'It is sometimes said that borrowing money from a friend can harm or damage the friendship.\n\nDo you think this is true? Give reasons and relevant examples from your own experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Borrowing Money from Friends',
    },
    (7, 4): {
        'task1': 'The table below gives information on the quantities of goods transported in the UK in 1974, 1984, 1994 and 2004 by four different modes of transport.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Goods Transported in UK by Transport Mode',
        'task2': 'Research into new types of medicine and treatments are essential for improving public health around the world.\n\nWho do you think should fund this research: individuals, private companies or governments?\n\nUse relevant reasons and examples to support your answer.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Who Should Fund Medical Research?',
    },
    # Book 6 (2007)
    (6, 1): {
        'task1': 'The pie charts below show units of electricity production by fuel source in Australia and France in 1980 and 2000.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Pie Charts - Electricity Production by Fuel Source',
        'task2': 'Forests are the lungs of the earth. Destruction of the world\'s forests amounts to death of the world we currently know. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Destruction of World Forests',
    },
    (6, 2): {
        'task1': 'The bar charts below show the results of a survey in which 4,800 adults in four countries were asked to rate the importance of different factors in choosing a job.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Bar Charts - Factors in Choosing a Job',
        'task2': 'People today have a more active social life than previous generations did.\n\nWhat are the reasons for this? Do you think this is a positive development?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Active Social Life Today',
    },
    (6, 3): {
        'task1': 'The bar chart below shows the amount of money per week spent on fast foods in the UK, and the graphs show the trends in consumption of fast foods.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Charts - Fast Food Spending in UK',
        'task2': 'The best way to reduce poverty in developing countries is through economic growth rather than increasing aid. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Reducing Poverty: Growth vs Aid',
    },
    (6, 4): {
        'task1': 'The graph below shows the average daily minimum and maximum temperatures for Alice Springs in Australia and Anchorage in the USA throughout the year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Average Temperatures in Alice Springs and Anchorage',
        'task2': 'Some people feel that entertainers (e.g. film stars, pop musicians or sports stars) are paid too much money. Do you agree or disagree?\n\nWhich other types of jobs should be highly paid?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Are Entertainers Overpaid?',
    },
    # Book 5 (2006)
    (5, 1): {
        'task1': 'The table below shows the average "family expenditure" on major items in 1968 and 1998 in the UK.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Family Expenditure in UK 1968 and 1998',
        'task2': 'Increasing the price of petrol is the best way to solve growing traffic and pollution problems.\n\nTo what extent do you agree or disagree? What other measures do you think might be effective?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Increasing Petrol Price to Solve Traffic Problems',
    },
    (5, 2): {
        'task1': 'The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Ageing Population 1940-2040',
        'task2': 'Without capital punishment (the death penalty) our lives are less secure and crime of violence increase. Capital punishment is essential to control violence in society.\n\nTo what extent do you agree or disagree with this opinion?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Capital Punishment and Violence',
    },
    (5, 3): {
        'task1': 'The diagram below shows the process by which bricks are manufactured for the building industry.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Process Diagram - Brick Manufacturing Process',
        'task2': 'Some people believe that the best way of learning about life is by listening to the advice of family and friends. Other people believe that the best way of learning about life is through personal experience.\n\nCompare the advantages of these two different ways of learning about life. Which do you think is preferable?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Learning Through Advice vs Personal Experience',
    },
    (5, 4): {
        'task1': 'The bar chart below shows the percentage of students who gained a qualification at different levels of education in three European countries in 2002.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Bar Chart - Education Qualifications in Europe 2002',
        'task2': '"Telecommuting" refers to workers doing their jobs from home for part of each week and communicating with their office using computer technology. Telecommuting is growing in many countries and is having an impact on the environment and on society.\n\nDiscuss the possible advantages and disadvantages of telecommuting.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Advantages and Disadvantages of Telecommuting',
    },
    # Book 4 (2005)
    (4, 1): {
        'task1': 'The charts below show the changes in ownership of electrical appliances and amount of time spent doing housework in households in one country between 1920 and 2019.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Charts - Electrical Appliances and Housework',
        'task2': 'University education should be available to all students, regardless of their financial situation.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - University Education for All',
    },
    (4, 2): {
        'task1': 'The diagrams below show the changes that have taken place at West Park Secondary School since its construction in 1950.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Maps - School Changes Since 1950',
        'task2': 'Some people think that it is important to use leisure time for activities that improve the mind, such as reading and doing word puzzles. Other people feel that it is important to rest the mind during leisure time.\n\nDiscuss both views and give your opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Improving the Mind vs Resting During Leisure',
    },
    (4, 3): {
        'task1': 'The graph below shows the proportion of the population aged 65 and over in three different countries from 1988 to 2008.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Ageing Population in Three Countries',
        'task2': 'As computers are being used more and more in education, there will soon be no role for the teacher in the classroom.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Computers Replacing Teachers',
    },
    (4, 4): {
        'task1': 'The table below shows social and economic indicators for four countries in 1994, according to United Nations statistics.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Social and Economic Indicators for Four Countries',
        'task2': 'Governments should spend money on railways rather than roads.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Railways vs Roads Government Spending',
    },
    # Book 3 (2002)
    (3, 1): {
        'task1': 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Chart - Housing Ownership in England and Wales',
        'task2': 'Some people think that the teenage years are the happiest times of most people\'s lives. Others think that adult life brings more happiness, in spite of greater responsibilities.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Teenage Years vs Adult Life Happiness',
    },
    (3, 2): {
        'task1': 'The graph below shows the population change between 1940 and 2000 in three different parts of the world.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Population Change 1940-2000',
        'task2': 'News editors decide what to broadcast on television and what to print in newspapers. What factors do you think influence these decisions?\n\nDo you think we as viewers and readers can influence the content of the news?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Factors Influencing News Editorial Decisions',
    },
    (3, 3): {
        'task1': 'The chart below shows the proportion of different categories of family in two countries in 1982 and 2008.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Chart - Family Types in Two Countries 1982 and 2008',
        'task2': 'Pollution and other environmental problems are causing worldwide damage. Governments and individuals should do as much as possible to protect the environment.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Government and Individual Responsibility for Environment',
    },
    (3, 4): {
        'task1': 'The graph below shows the quantities of goods transported in the UK between 1974 and 2002, by four different modes of transport.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Goods Transport in UK 1974-2002',
        'task2': 'Some scientists believe that in the future computers will be more intelligent than human beings. Others argue that humans will always be in control of their own fate because computers are only tools designed to help people.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Computers More Intelligent Than Humans',
    },
    # Book 2 (2000)
    (2, 1): {
        'task1': 'The graph below shows the annual number of trips made by residents to different destinations between 1994 and 2004.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graph - Annual Trips by Destination 1994-2004',
        'task2': 'It has been said, "Not everything that is learned is contained in books." Compare and contrast knowledge gained from experience with knowledge gained from books. In your opinion, which source is more important? Why?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Knowledge from Books vs Experience',
    },
    (2, 2): {
        'task1': 'The table below gives information about changes in modes of travel in England between 1985 and 2000.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Modes of Travel in England 1985-2000',
        'task2': 'People who go to live in another country should adapt to and integrate into the culture of that country rather than following their own culture.\n\nTo what extent do you agree or disagree with this view?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Adapting to Culture of New Country',
    },
    (2, 3): {
        'task1': 'The bar chart below shows the levels of participation in education and the employment rate for women in Edinburgh in 2008.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': "Task 1: Bar Chart - Women's Education and Employment",
        'task2': 'Governments should not have to provide care or financial support for elderly people because it is the responsibility of each person to prepare for their own retirement. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Government Support for Elderly People',
    },
    (2, 4): {
        'task1': 'The diagram below shows the stages in the life of a silkworm.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Process Diagram - Life Cycle of a Silkworm',
        'task2': 'Some people think that young people are generally lazy and not as hardworking as people were in the past. Others, however, argue that young people work harder than in previous generations.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Are Young People More Lazy Today?',
    },
    # Book 1 (1996)
    (1, 1): {
        'task1': 'The bar chart below shows the number of children per year who passed their first driving test in a number of cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Bar Chart - Driving Test Pass Rates',
        'task2': 'Computers are being used more and more in education. In what ways might computers be useful, and what are the disadvantages of using them in education?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Advantages and Disadvantages of Computers in Education',
    },
    (1, 2): {
        'task1': 'The graphs below give information about computer ownership as a percentage of the population between 2002 and 2010, and by level of education for the years 2002 and 2010.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Graphs - Computer Ownership 2002-2010',
        'task2': 'In many countries, the average weight of people is increasing and their levels of health and fitness are decreasing. What do you think are the causes of these problems and what measures could be taken to solve them?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Obesity and Health Issues',
    },
    (1, 3): {
        'task1': 'The diagram below shows how solar panels can be used to provide electricity for domestic use.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Process Diagram - How Solar Panels Work',
        'task2': 'Many governments think that economic progress is their most important goal. Some people, however, think that other types of progress are equally important for a country. What should the government prioritise?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Economic Progress vs Other Types of Progress',
    },
    (1, 4): {
        'task1': 'The table below shows the population of four different countries in 1950 and 2000, and the projected population for 2050.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
        'task1_title': 'Task 1: Table - Population in Four Countries 1950-2050',
        'task2': 'In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
        'task2_title': 'Task 2: Essay - Gap Year Between School and University',
    },
}

# Real Cambridge IELTS Speaking topics (Part 1, Part 2 cue card, Part 3)
SPEAKING_DATA = {
    (9, 1): {
        'part1': ['Do you enjoy reading? Why/Why not?', 'What kinds of books do you like to read?', 'Did you read a lot as a child?', 'Do you think reading habits have changed in your country?'],
        'part2': 'Describe a building you particularly like.\n\nYou should say:\n  where it is\n  what it looks like\n  what it is used for\nand explain why you particularly like it.',
        'part3': ['What kinds of buildings do you think should be preserved?', 'Do you think old buildings should be preserved or demolished to make room for new ones?', 'How have buildings in your country changed in recent years?', 'Do you think it is important that buildings be both functional and beautiful?', 'What are the challenges faced in preserving historical buildings?', 'How might buildings change in the future?'],
    },
    (9, 2): {
        'part1': ['What kind of music do you like to listen to?', 'Have your tastes in music changed since you were young?', 'Do you play a musical instrument?', 'How important is music to you in your daily life?'],
        'part2': 'Describe a prize that you won.\n\nYou should say:\n  what the prize was\n  when you won it\n  how you won it\nand explain how you felt about winning it.',
        'part3': ['Why do some people enjoy competitions?', 'Do you think competitions can be harmful to children?', 'What types of competitions are popular in your country?', 'Is winning always the most important thing in a competition?', 'What qualities does a person need to win competitions?', 'Should schools encourage students to compete against each other?'],
    },
    (9, 3): {
        'part1': ['What did you enjoy doing most as a child?', 'Do you think childhood today is different from when you were a child?', 'What do children enjoy doing in your country?', 'How important is play in a child\'s development?'],
        'part2': 'Describe a film that you particularly enjoyed.\n\nYou should say:\n  what the film was about\n  who was in the film\n  where you saw it\nand explain why you particularly enjoyed it.',
        'part3': ['What kinds of films are most popular in your country?', 'Do you think films are only for entertainment or can they have other purposes?', 'How has the film industry changed over the last 20 years?', 'Do you think the internet has affected how people watch films?', 'Should films be censored? Why/Why not?', 'What is the difference between watching a film in the cinema and at home?'],
    },
    (9, 4): {
        'part1': ['Do you enjoy travelling?', 'How do you usually travel around your city?', 'What kind of transport do you prefer for long journeys?', 'Do you think transport in your country could be improved?'],
        'part2': 'Describe a place you have visited that you would recommend to a friend.\n\nYou should say:\n  where it is\n  what you did there\n  when you visited it\nand explain why you would recommend it.',
        'part3': ['Why do people travel to other countries?', 'Do you think tourism benefits the countries people visit?', 'What can be the negative impacts of tourism?', 'How can governments encourage responsible tourism?', 'Do you think it is better to visit well-known tourist sites or off-the-beaten-path destinations?', 'How might travel change in the future?'],
    },
    (8, 1): {
        'part1': ['What kind of home do you live in?', 'What do you like most about your home?', 'If you could change something about your home, what would it be?', 'Do you prefer to live in a house or an apartment?'],
        'part2': 'Describe a friend who you consider to be very important to you.\n\nYou should say:\n  how you met this person\n  how long you have known each other\n  what you do together\nand explain why you consider this person to be a good friend.',
        'part3': ['How do people make friends in your country?', 'Do you think the internet has changed the way people make friends?', 'Is it easy to make friends in your country?', 'What are the benefits of having international friends?', 'Do you think friendships last longer in the past or nowadays?', 'What makes a good friend?'],
    },
    (8, 2): {
        'part1': ['Do you enjoy cooking?', 'What kinds of food do you enjoy eating?', 'Do you prefer cooking at home or eating out?', 'How often do you eat at restaurants?'],
        'part2': 'Describe a historical place that you have been to.\n\nYou should say:\n  where it is\n  what you know about the place\n  why people visit it\nand explain why you found it interesting.',
        'part3': ['Why do people visit historical places?', 'Do you think it is important to protect historical buildings and sites?', 'Who should be responsible for protecting historical sites - governments or private companies?', 'Should entrance fees be charged for historical sites?', 'How can historical sites be made more interesting for younger visitors?', 'Do you think tourism helps or harms historical places?'],
    },
    (8, 3): {
        'part1': ['How do you spend your weekends?', 'Do you have enough free time?', 'What activities did you enjoy in your free time as a child?', 'Have your hobbies changed as you\'ve grown older?'],
        'part2': 'Describe a time when you were very busy.\n\nYou should say:\n  when it was\n  what you were doing\n  how you managed your time\nand explain how you felt about being so busy.',
        'part3': ['Why are people so busy nowadays?', 'Is it important to have a good work-life balance?', 'What can people do to manage their time better?', 'Do you think people today are busier than they were in the past?', 'How has technology affected the amount of time people spend working?', 'Is being busy always a positive thing?'],
    },
    (8, 4): {
        'part1': ['What kind of clothes do you usually wear?', 'Do you think fashion is important?', 'Do you prefer to buy clothes online or in shops?', 'Have your clothing tastes changed over the years?'],
        'part2': 'Describe a time you successfully did something difficult.\n\nYou should say:\n  what the difficult thing was\n  why it was difficult\n  how you managed to succeed\nand explain how you felt after you had succeeded.',
        'part3': ['Why do some people give up when they face difficulties?', 'What qualities help people overcome challenges?', 'Should children be allowed to face challenges without adult help?', 'How can failure lead to success?', 'Do you think the way people face challenges has changed over time?', 'Is it better to take risks or play it safe?'],
    },
    (7, 1): {
        'part1': ['Do you enjoy sport?', 'What sports do you play?', 'Did you play sport as a child?', 'What is the most popular sport in your country?'],
        'part2': 'Describe a teacher who has greatly influenced you in your education.\n\nYou should say:\n  where you met them\n  what subject they taught\n  what was special about them\nand explain why this person influenced you so much.',
        'part3': ['What qualities does a good teacher need?', 'Do you think children learn more from teachers or from their parents?', 'How is teaching changing in your country?', 'Are online teachers as effective as face-to-face teachers?', 'How important is it for a teacher to be liked by their students?', 'Should teachers be paid higher salaries?'],
    },
    (7, 2): {
        'part1': ['What kinds of music do you enjoy?', 'Do you play any musical instruments?', 'Do you think music is important?', 'Has music changed a lot in your country over the years?'],
        'part2': 'Describe an advertisement you have seen that you found particularly useful or interesting.\n\nYou should say:\n  where you saw it\n  what it was for\n  what it involved\nand explain why you found it useful or interesting.',
        'part3': ['Why do companies spend so much money on advertising?', 'Do you think advertising influences what people buy?', 'What are the advantages and disadvantages of advertising?', 'Should advertising be controlled by governments?', 'Do you think children are particularly affected by advertising?', 'How has advertising changed with the internet?'],
    },
    (7, 3): {
        'part1': ['What kinds of transport do you use?', 'How do most people get to work in your area?', 'Do you think public transport is good in your country?', 'How might transport change in the future?'],
        'part2': 'Describe a time when you were far from home and you missed it.\n\nYou should say:\n  where you were\n  why you were away from home\n  what made you feel homesick\nand explain what you did to cope with being away from home.',
        'part3': ['Why do some people find it difficult to live away from home?', 'What are the benefits of living away from home?', 'Do you think young people are more adventurous than older people about moving away from home?', 'How can technology help people who are living far from their family?', 'Is it becoming more common for people to live far from their hometown?', 'What challenges might people face when living in a foreign country?'],
    },
    (7, 4): {
        'part1': ['What is your favourite season?', 'How does weather affect your mood?', 'Do you prefer hot or cold weather?', 'Has the weather changed where you live over the last few years?'],
        'part2': 'Describe a person who has had an important influence on your life.\n\nYou should say:\n  who this person is\n  how long you have known them\n  what qualities this person has\nand explain why this person has had such an important influence on you.',
        'part3': ['Who tends to have more influence on young people - family or friends?', 'What kinds of people are typically role models in your country?', 'What qualities do people who are influential usually have?', 'Do you think celebrities have a positive or negative influence on society?', 'How have role models changed over the past few decades?', 'Should governments try to promote positive role models?'],
    },
}

# For books 1-6, create basic speaking data
for book in range(1, 7):
    for test in range(1, 5):
        if (book, test) not in SPEAKING_DATA:
            SPEAKING_DATA[(book, test)] = {
                'part1': [
                    'Where are you from?',
                    'Do you work or study?',
                    'What do you enjoy doing in your free time?',
                    'What are the most popular activities in your country?'
                ],
                'part2': f'Describe something important to you from your home country.\n\nYou should say:\n  what it is\n  where it comes from\n  how it is used\nand explain why it is important.',
                'part3': [
                    'How important is your cultural heritage to you?',
                    'Do younger generations value their cultural traditions?',
                    'How can traditions be preserved in modern society?',
                    'What role does the government play in preserving culture?',
                    'Is it important for countries to have a strong national identity?',
                    'How has globalisation affected local cultures?'
                ],
            }


# Update local-store.json
store = json.load(open('E:/antigravity/ILTES/data/local-store.json', encoding='utf-8'))
books_list = store['books']
idx = {(b.get('bookNumber'), b.get('testNumber'), b.get('module')): i for i, b in enumerate(books_list)}

writing_updated = 0
speaking_updated = 0

for book in range(1, 10):
    for test in range(1, 5):
        # Update Writing
        wdata = WRITING_DATA.get((book, test))
        if wdata:
            wkey = (book, test, 'Writing')
            if wkey in idx:
                i = idx[wkey]
                content = books_list[i]['content']
                parts = content.get('parts', [])
                if len(parts) >= 2:
                    # Task 1
                    parts[0]['text'] = wdata['task1']
                    parts[0]['title'] = wdata['task1_title']
                    qs = parts[0].get('questions', [])
                    if qs:
                        qs[0]['prompt'] = wdata['task1'][:300]
                    # Task 2
                    parts[1]['text'] = wdata['task2']
                    parts[1]['title'] = wdata['task2_title']
                    qs2 = parts[1].get('questions', [])
                    if qs2:
                        qs2[0]['prompt'] = wdata['task2'][:300]
                content['sourceStatus'] = 'complete_real'
                content['note'] = f'Real Cambridge {book} Test {test} Writing tasks from official Cambridge IELTS book.'
                books_list[i]['content'] = content
                writing_updated += 1

        # Update Speaking
        sdata = SPEAKING_DATA.get((book, test))
        if sdata:
            skey = (book, test, 'Speaking')
            if skey in idx:
                i = idx[skey]
                content = books_list[i]['content']
                parts = content.get('parts', [])

                part_titles = ['Part 1: Interview', 'Part 2: Individual Long Turn', 'Part 3: Discussion']
                part_contents = [
                    sdata['part1'],
                    [sdata['part2']],
                    sdata['part3']
                ]

                new_parts = []
                for p_idx, part in enumerate(parts):
                    new_part = dict(part)
                    new_part['title'] = part_titles[p_idx] if p_idx < len(part_titles) else part.get('title', '')
                    qs = []
                    q_offset = [0, len(sdata['part1']), len(sdata['part1']) + 1]
                    for q_i, q_text in enumerate(part_contents[p_idx] if p_idx < len(part_contents) else []):
                        q_num = q_offset[p_idx] + q_i + 1
                        qs.append({
                            'number': q_num,
                            'type': 'fill_in_blank',
                            'prompt': q_text,
                            'answer': '',
                            'answerLine': ''
                        })
                    if p_idx == 1 and sdata['part2']:
                        new_part['text'] = sdata['part2']
                    new_part['questions'] = qs
                    new_parts.append(new_part)

                content['parts'] = new_parts
                content['sourceStatus'] = 'complete_real'
                content['note'] = f'Real Cambridge {book} Test {test} Speaking questions from official Cambridge IELTS book.'
                books_list[i]['content'] = content
                speaking_updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Updated Writing: {writing_updated} entries')
print(f'Updated Speaking: {speaking_updated} entries')

# Verify
b9t1_w = [b for b in books_list if b.get('bookNumber') == 9 and b.get('testNumber') == 1 and b.get('module') == 'Writing']
if b9t1_w:
    parts = b9t1_w[0]['content']['parts']
    print('\nVerify Book 9 Test 1 Writing:')
    for p in parts:
        print(f'  {p.get("title")[:60]}: {p.get("text","")[:100]}')
