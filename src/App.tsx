import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, CardActions, CardContent, Checkbox, Chip, Container, createTheme, FormControlLabel, FormGroup, Grid, IconButton, Input, InputAdornment, Link, Radio, RadioGroup, Skeleton, Slider, Stack, TextField, ThemeProvider, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchResults, fetchResultsQuery, Filters } from './api/api';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import './styles.scss';
import { ArrowDropDown } from '@mui/icons-material';

const json: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://github.com/zhalkhas/fh_2024/internal/models/cv-query",
  "properties": {
    "keywords": {
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "experience": {
      "properties": {
        "position": {
          "type": "string"
        },
        "company": {
          "type": "string"
        },
        "keywords": {
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "additionalProperties": false,
      "type": "object",
      "required": [
        "position",
        "company",
        "keywords"
      ]
    },
    "education": {
      "properties": {
        "degree": {
          "type": "string"
        },
        "school": {
          "type": "string"
        },
        "field_of_study": {
          "type": "string"
        },
        "keywords": {
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "additionalProperties": false,
      "type": "object",
      "required": [
        "degree",
        "school",
        "field_of_study",
        "keywords"
      ]
    },
    "skill": {
      "properties": {
        "name": {
          "type": "string"
        },
        "keywords": {
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "additionalProperties": false,
      "type": "object",
      "required": [
        "name",
        "keywords"
      ]
    }
  },
  "additionalProperties": false,
  "type": "object",
  "required": [
    "keywords",
    "experience",
    "education",
    "skill"
  ]
}

// const positionLabels = ['Менеджер', 'Актер', 'Бухгалтер'];
const positionLabels = [
  "CEO",
  "PR-менеджер",
  "Product Manager, Project Manager",
  "SMM-менеджер",
  "Автор и разработчик игр",
  "Аналитик",
  "Арт-коуч",
  "Ассистент проекта анализа и миграции персональных данных",
  "Бухгалтер",
  "Главный эксперт информационно-аналитического отдела",
  "Дизайнер",
  "Директор по продажам/Бренд-менеджер",
  "Директор Филиала",
  "Директор",
  "Журналист, ведущий программы, корреспондент",
  "Зам. директора - Коммерческий директор",
  "Заместитель директора",
  "Индивидуальный предприниматель",
  "Инженер по информационному обеспечению",
  "Инструктор аппарата Центрального комитета",
  "Исполнительный директор",
  "Команда в сетевом маркетинге",
  "Коммерческий директор",
  "Координатор международных школьных проектов",
  "Копирайтер (фриланс)",
  "Логист, оператор 1С бухгалтерия, завсклад",
  "Маркетолог",
  "Менеджер по маркетингу и рекламе",
  "Менеджер по рекламе",
  "Менеджер проекта",
  "Ментор",
  "Начальник отдела продаж, Заместитель директора",
  "Обучение и консультирование экспертов Инстаграм",
  "Обучение и консультирование экспертов",
  "Преподаватель",
  "Программист",
  "Проектировщик и специалист по тендерам",
  "Региональный менеджер по маркетингу и рекламе",
  "Региональный менеджер по продажам и маркетингу",
  "Руководитель отдела рекламы",
  "Руководитель проекта BI-аналитики",
  "Руководитель проекта",
  "Руководитель проектов и тренер",
  "Системный администратор, дизайнер",
  "Системный администратор",
  "Создатель и главный редактор",
  "Сооснователь стартапа",
  "Сотрудник пресс-службы акима города Алматы",
  "Специалист по информационному обеспечению",
  "Старший менеджер по продаже рекламных возможностей",
  "Старший Трекер, Трекер, Эксперт",
  "Трекер",
]
const educationLabels = ['Любое', 'Без образования', 'Среднее', 'Высшее', 'Неоконченное высшее', 'Магистратура', 'Докторантура'];

// const companyLabels =['Air Astana', 'Samruq Kazyna'];

const companyLabels = [
  'Amway',
  'Atameken Academy',
  'BuroIn',
  'IT-hub',
  'IT-холдинг',
  'Kazakhstan Digital Accelerator',
  'PZG Group',
  'Qmind',
  'upstartup.global',
  'АО Казахтелеком, Центральная региональная дирекция телекоммуникаций',
  'Аманат, ТОО',
  'Вестер-Гипер-Казахстан',
  'ВкусВилл, Агама, Сбербанк, ФРИИ, Scalerator, Стартех',
  'Журнал «Вестник природопользователя Сары-Арки»',
  'КарГТУ Факультет предпринимательства и управления',
  'Кондитерские изделия',
  'Народный банк Казахстана, АО',
  'ОО Коммунистическая Народная партия Казахстана',
  'ОО Центр координации и информации по экологическому образованию «ЭкоОбраз»',
  'Пивзавоз групп',
  'Республика Узбекистан, Наманганская Ассоциация Адвокатов',
  'Республика Узбекистан, дистрибьюторская компания «Dicom Service»',
  'Самозанятый',
  'Столплит',
  'ТОО',
  'ТОО "Honmil Group", г. Караганда',
  'ТОО "МП Алматау", г. Караганда и г.Нур-Султан',
  'ТОО Profit Group KZ',
  'ТОО Yuwert-IT',
  'ТОО «Meerbusch Construction», ТОО «Инте-Астана»',
  'ТОО «Аттис-Телеком-Трейд»',
  'ТОО «Инвалид Корпорэйшн «Жан Дос»',
  'ТОО «Караганда-Бахус», г. Караганда',
  'ТОО «Проектсервис»',
  'ТОО «Умные праздники»',
  'ТОО Аттис-Телеком-Трейд',
  'ТОО Инвалид Корпорэйшн "Жан Дос"',
  'ТОО Юнайтед медиа',
  'ТОО “KAZPROM AVTOMATIKA”',
  'Телеканал 5 канал Караганда',
  'Телеканал Первый Карагандинский (ТВК)',
  'Филиал ТОО "Астана Периодика", г. Караганда',
  'Центральная региональная дирекция телекоммуникаций - филиал АО "Казахтелеком", г. Караганда',
  'ЧП Ким В.М. магазин «Жарасым», г. Караганда',
  'бизнес-инкубатор',
  'г. Астана, Риэлтерская компания «Азбука Жилья»',
  'г. Астана, Строительно-риэлтерская компания «Asia-Group Company Ltd»',
  'казахмыс Serviсes Limited'
];


function expValueLabelFormat(exp: number) {
  return exp === 1 || exp === 21 ? 'год' : 'лет';
}

function renderSkeletons() {
  const skeletons = [];

  for (let i = 0; i < 10; i++) {
    skeletons.push(<Skeleton className='skeleton' animation='pulse' key={i} variant='rounded' width={'100%'} height={100} />);
  }

  return skeletons;
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [fetchQuery, setFetchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  const [exp, setExp] = useState<number>(0);
  const [education, setEducation] = useState<typeof educationLabels[number]>('');
  const [companies, setCompanies] = useState<typeof companyLabels[number][]>([]);
  const [positions, setPositions] = useState<typeof positionLabels[number][]>([]);

  const [positionsSearchResults, setPositionsSearchResults] = useState<string[]>(positionLabels);
  const [positionSearch, setPositionSearch] = useState<string>('');

  const [companiesSearchResults, setCompaniesSearchResults] = useState<string[]>(companyLabels);
  const [companiesSearch, setCompaniesSearch] = useState<string>('');

  const [results, setResults] = useState<any>([]);

  // Debounce logic
  // useEffect(() => {
    // const handler = setTimeout(() => setDebouncedQuery(query), 200);
    // return () => clearTimeout(handler);
  // }, [query]);

  // Correctly typed useQuery with SearchResult[] as the data type
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['searchResults'],
    queryFn: () => fetchResults(),
    enabled: query.length === 0,
  });

  const { data: dataQuery, isLoading: isLoadingQuery } = useQuery({
    queryKey: ['searchResultsQuery'],
    queryFn: () => fetchResultsQuery(query),
    enabled: fetchQuery.length !== 0,
  });

  console.log(data);
  console.log(dataQuery);

  useEffect(() => {
    // if(query.length === 0) {
    //   setResults(data);
    // }

    const handler = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(handler);
  }, [query]);

  console.log(results);

  // if (error instanceof Error) return <p>Error: {error.message}</p>;
  
  // Ensure data is not undefined by providing a default empty array if necessary
  // const searchResults = data ?? [];

  const handleExpSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setExp(newValue);
    }
  };

  // const handleEducationSliderChange = (event: Event, newValue: number | number[]) => {
  //   if (typeof newValue === 'number') {
  //     setEducation(newValue);
  //   }
  // };

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const q = event.target.value;
    setQuery(q);
    // setFetchQuery(q);
  };


  function handlePositionSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const q = event.target.value;

    setPositionSearch(q);

    const f = positionLabels.filter(p => p.toLowerCase().includes(q.toLowerCase()));
    console.log(f);

    q.length === 0 ? setPositionsSearchResults(positionLabels) : setPositionsSearchResults(f);
  };
  
  function handleCompanySearchChange(event: ChangeEvent<HTMLInputElement>) {
    const q = event.target.value;

    setCompaniesSearch(q);

    const f = companyLabels.filter(c => c.toLowerCase().includes(q.toLowerCase()));
    console.log(f);

    q.length === 0 ? setCompaniesSearchResults(companyLabels) : setCompaniesSearchResults(f);
  };

  async function handleSearchButton() {
    // alert(query);

    // const r: any = await fetchResultsQuery(query);
    // // const json = await r.json();

    // console.log(r);

    // setResults(r);
    // refetch();

    setFetchQuery(query);
  }

  function handleExpInputChange(event: ChangeEvent<HTMLInputElement>) {
    setExp(Number(event.target.value));
  }

  function handleEducationInputChange(event: ChangeEvent<HTMLInputElement>) {
    setEducation(event.target.value);
  }

  function handleCompanies(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;

    setCompanies((prevSelectedOptions) =>
      checked
        ? [...prevSelectedOptions, value]  // Add to selected if checked
        : prevSelectedOptions.filter((option) => option !== value)  // Remove if unchecked
    );
  }

  function handlePositions(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;

    setPositions((prevSelectedOptions) =>
      checked
        ? [...prevSelectedOptions, value]  // Add to selected if checked
        : prevSelectedOptions.filter((option) => option !== value)  // Remove if unchecked
    );
  }

  function appendPositionsToQuery() {
    if (positions.length === 0) return '';

    return (query.length === 0 ? '' : ' ') + ('Должность: ' + positions.map(p => p + ' '))  + ' ';
  }

  function appendExpToQuery() {
    if (exp === 0) return '';

    return (query.length === 0 ? '' : ' ') + 'Минимум лет опыта: ' + exp + ' ';
  }

  function appendEducationToQuery() {
    if (education === 'Любое' || education === '') return '';

    return (query.length === 0 ? '' : ' ') + 'Образование: ' + education + ' ';
  }

  function appendCompaniesToQuery() {
    if (companies.length === 0) return '';

    return (query.length === 0 ? '' : ' ') + 'Опыт в компаниях: ' + companies + ' ';
  }
  
  function clearAllFilters() {
    setExp(0);
    setEducation('Любое');
    setCompanies([]);
    setPositions([]);
  }

  function applyAllFilters() {
    console.log(query);
    if(query.length === 0) {
      setQuery('');
    }
    console.log(query);

    const queryBase = (query.length === 0 ? '' : query.split(', ')[0]);
    const tempQuery = queryBase  + appendPositionsToQuery() + appendExpToQuery() + appendEducationToQuery() + appendCompaniesToQuery();
    setQuery(tempQuery);

    // setQuery(query.split(' ')[0] + ' Минимум лет опыта: ' + exp + ', Образование: ' + (education.length === 0 ? 'Любое' : education) + ', Компании: ' + companies);

    // TODO: set actual query for backend
    // setFetchQuery();
  }

  return (
      <Container maxWidth='lg' style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '2rem',
      }}>
        <Box className='search-box'>
          <TextField 
            id="outlined-search"
            label="Поиск кандидата"
            variant="outlined"
            color="success"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleQueryChange(e)}
            value={query}
            slotProps={{
              input: {
                className: 'search-input',
                endAdornment: (
                  <InputAdornment position='end'>
                    {query.length > 0 ? <IconButton onClick={() => {setQuery(''); setFetchQuery('')}}><CloseIcon /></IconButton> : ''}
                  </InputAdornment>
                )
              }
            }}
          >
          </TextField>
          <Button className='search-button' variant='contained' color='success' onClick={handleSearchButton} endIcon={<SearchIcon />}>
            Искать
          </Button>
        </Box>
        <Box my={4} gap={1} className='container-box'>
          <Box className='filters-box'>
            Дополнительные фильтры:
            <Stack spacing={1} className='accordion-stack'>
              <Accordion className='accordion'>
                <AccordionSummary className='accordion-summary' expandIcon={<ArrowDropDown />}>
                  <Typography>Должность</Typography>
                </AccordionSummary>
                <AccordionDetails className='accordion-details'>
                  <TextField
                      label="Поиск должности"
                      variant="outlined"
                      color="success"
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handlePositionSearchChange(e)}
                      value={positionSearch}
                      slotProps={{
                        input: {
                          className: 'search-input',
                          endAdornment: (
                            <InputAdornment position='end'>
                              <SearchIcon />
                            </InputAdornment>
                          )
                        }
                      }}
                  ></TextField>
                  <FormGroup className='accordion-summary-form-group'>
                    {positionsSearchResults.map(position => 
                      <FormControlLabel
                        className='position-label'
                        key={position}
                        control={<Checkbox value={position} checked={positions.includes(position)} onChange={handlePositions} color='success'/>} 
                        label={position} />
                    )}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion className='accordion'>
                <AccordionSummary className='accordion-summary' expandIcon={<ArrowDropDown />}>
                  Опыт
                </AccordionSummary>
                <AccordionDetails className='accordion-summary'>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                    <Input style={{
                      width: '3rem',
                      textAlign: 'center',
                    }}
                    color='success' type='number' value={exp} onChange={(e: ChangeEvent<HTMLInputElement>) => handleExpInputChange(e)}></Input>
                    <Typography>{expValueLabelFormat(exp)}</Typography>
                  </div>
                  <Slider
                    color='success'
                    value={exp}
                    step={1}
                    min={0}
                    max={30}
                    onChange={handleExpSliderChange}
                    // scale={4}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion className='accordion'>
                <AccordionSummary className='accordion-summary' expandIcon={<ArrowDropDown />}>
                  Образование
                </AccordionSummary>
                <AccordionDetails className='accordion-summary'>   
                  <RadioGroup value={education} onChange={handleEducationInputChange}>
                    {educationLabels.map(label => 
                      <FormControlLabel 
                        control={<Radio color='success'/>} 
                        label={label}
                        key={label}
                        // value={label === 'Любое' ? '' : label}
                        value={label}
                      />
                    )}
                  </RadioGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion className='accordion'>
                <AccordionSummary className='accordion-summary' expandIcon={<ArrowDropDown />}>
                  <Typography>Опыт в компаниях</Typography>
                </AccordionSummary>
                <AccordionDetails className='accordion-summary'>
                <TextField
                      label="Поиск компаний"
                      variant="outlined"
                      color="success"
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleCompanySearchChange(e)}
                      value={companiesSearch}
                      slotProps={{
                        input: {
                          className: 'search-input',
                          endAdornment: (
                            <InputAdornment position='end'>
                              <SearchIcon />
                            </InputAdornment>
                          )
                        }
                      }}
                  ></TextField>
                  <FormGroup className='accordion-summary-form-group'>
                    {companiesSearchResults.map(company => 
                      <FormControlLabel
                        className='company-label'
                        key={company}
                        control={<Checkbox value={company} checked={companies.includes(company)} onChange={handleCompanies} color='success'/>} 
                        label={company} />
                    )}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Button variant='contained' color='success' onClick={applyAllFilters}>Применить фильтры</Button>
              <Button color='success' onClick={clearAllFilters}>Сбросить фильтры</Button>
            </Stack>
          </Box>
          <Box className="results-box">
            {(isLoading || isLoadingQuery)
              ? renderSkeletons()
              : (fetchQuery.length === 0 
                ? data?.map((cv: any) => 
              <Card className='cv-card' key={cv.url}>
                <CardContent className='cv-card-content'>
                  {cv.experience.length !== 0 && <h2>Опыт работы</h2>}
                  {cv.experience.length !== 0 && cv.experience.map((ex: any, index: number) => (
                      <Box key={ex.position + index}>
                        <h4>{ex.position} - {ex.company}</h4>
                        <p>{ex.description}</p>
                        <p>Срок работы: <span><b>{ex.duration.year > 0 ? ex.duration.year + ' лет ' : '' }{ex.duration.month > 0 ? ex.duration.month + ' месяцев' : '' }</b></span> ({ex.start_date} - {ex.end_date === '' ? 'Настоящее время' : ex.end_date})</p>
                        
                        <Box className='chips'>
                          <Typography>Ключевые слова: </Typography>
                          {ex.keywords && ex.keywords.map((kw: any) => (
                            <Chip label={String(kw).charAt(0).toUpperCase() + kw.slice(1)} color='success' style={{margin: '0.2rem'}} />
                          ))}
                        </Box>
                        <hr></hr>
                      </Box>
                    ))}

                    {cv.education.length !== 0 && <h2>Образование</h2>}
                    {cv.education.length !== 0 && cv.education.map((ed: any, index: number) => (
                      <Box key={ed.school + index}>
                        <h4>{ed.degree} - {ed.school} - {ed.field_of_study}</h4>
                        <p>{ed.description}</p>
                        <p>Срок учебы: <span><b>({ed.start_date} - {ed.end_date === '' ? 'Настоящее время' : ed.end_date})</b></span></p>
                        
                        <Box className='chips'>
                          <Typography>Ключевые слова: </Typography>
                          {ed.keywords && ed.keywords.map((kw: any) => (
                            <Chip label={String(kw).charAt(0).toUpperCase() + kw.slice(1)} color='success' style={{margin: '0.2rem'}} />
                          ))}
                        </Box>
                        <hr></hr>
                      </Box>
                    ))}

                    {cv.projects.length !== 0 && <h2>Проекты</h2>}
                    {cv.projects.length !== 0 && cv.projects.map((pj: any, index: number) => (
                      <Box key={pj.name + index}>
                        <h4>{pj.name} - {pj.description}</h4>

                        <Box className='chips'>
                          <Typography>Ключевые слова: </Typography>
                          {pj.keywords && pj.keywords.map((kw: any) => (
                            <Chip label={String(kw).charAt(0).toUpperCase() + kw.slice(1)} color='success' style={{margin: '0.2rem'}} />
                          ))}
                        </Box>
                        <hr></hr>
                      </Box>
                    ))}

                    {cv.skills.length !== 0 && <h2>Навыки</h2>}
                    {cv.skills.length !== 0 && cv.skills.map((sk: any, index: number) => (
                      <Box key={sk.name + index}>
                        {sk.name}
                      </Box>
                    ))}
                    {cv.skills.length !== 0 && <hr></hr>}


                    {cv.languages.length !== 0 && <h2>Языки</h2>}
                    {cv.languages.length !== 0 && cv.languages.map((lg: any, index: number) => (
                      <Box key={lg.name + index}>
                        {lg.name}
                      </Box>
                    ))}
                    {cv.languages.length !== 0 && <hr></hr>}

                    {cv.additional_data.length !== 0 && <h2>Дополнительая информация</h2>}
                    {cv.additional_data.length !== 0 && cv.additional_data.map((ad: any, index: number) => (
                      <Box key={ad.name + index}>
                        {ad.name} - {ad.value}
                      </Box>
                    ))}
                    {cv.additional_data.length !== 0 && <hr></hr>}


                    {(cv.contact_info.name !== 'N/A' || cv.contact_info.email !== 'N/A' || cv.contact_info.phone !== 'N/A') && <h2>Контактная информация</h2>}
                    
                    {cv.contact_info.name !== 'N/A' && <p>Имя: {cv.contact_info.name}</p>}
                    {cv.contact_info.email !== 'N/A' && <p>Email: {cv.contact_info.email}</p>}
                    {cv.contact_info.phone !== 'N/A' && <p>Телефон: {cv.contact_info.phone}</p>}
                    {(cv.contact_info.name !== 'N/A' || cv.contact_info.email !== 'N/A' || cv.contact_info.phone !== 'N/A') && <hr></hr>}
                </CardContent>
                <CardActions className='card-actions'>
                  <Link className='see-cv' href={cv.url} target="_blank" variant='button'>Посмотреть резюме</Link>
                </CardActions>
              </Card>
            ) :
            (dataQuery?.map((cv: any) => 
              <Card className='cv-card' key={cv.url}>
                <CardContent className='cv-card-content'>
                  {cv.experience.length !== 0 && <h2>Опыт работы</h2>}
                  {cv.experience.length !== 0 && cv.experience.map((ex: any, index: number) => (
                      <Box key={ex.position + index}>
                        <h4>{ex.position} - {ex.company}</h4>
                        <p>{ex.description}</p>
                        <p>Срок работы: <span><b>{ex.duration.year > 0 ? ex.duration.year + ' лет ' : '' }{ex.duration.month > 0 ? ex.duration.month + ' месяцев' : '' }</b></span> ({ex.start_date} - {ex.end_date === '' ? 'Настоящее время' : ex.end_date})</p>
                        
                        <Box className='chips'>
                          <Typography>Ключевые слова: </Typography>
                          {ex.keywords && ex.keywords.map((kw: any) => (
                            <Chip label={String(kw).charAt(0).toUpperCase() + kw.slice(1)} color='success' style={{margin: '0.2rem'}} />
                          ))}
                        </Box>
                        <hr></hr>
                      </Box>
                    ))}

                    {cv.education.length !== 0 && <h2>Образование</h2>}
                    {cv.education.length !== 0 && cv.education.map((ed: any, index: number) => (
                      <Box key={ed.school + index}>
                        <h4>{ed.degree} - {ed.school} - {ed.field_of_study}</h4>
                        <p>{ed.description}</p>
                        <p>Срок учебы: <span><b>({ed.start_date} - {ed.end_date === '' ? 'Настоящее время' : ed.end_date})</b></span></p>
                        
                        <Box className='chips'>
                          <Typography>Ключевые слова: </Typography>
                          {ed.keywords && ed.keywords.map((kw: any) => (
                            <Chip label={String(kw).charAt(0).toUpperCase() + kw.slice(1)} color='success' style={{margin: '0.2rem'}} />
                          ))}
                        </Box>
                        <hr></hr>
                      </Box>
                    ))}

                    {cv.projects.length !== 0 && <h2>Проекты</h2>}
                    {cv.projects.length !== 0 && cv.projects.map((pj: any, index: number) => (
                      <Box key={pj.name + index}>
                        <h4>{pj.name} - {pj.description}</h4>

                        <Box className='chips'>
                          <Typography>Ключевые слова: </Typography>
                          {pj.keywords && pj.keywords.map((kw: any) => (
                            <Chip label={String(kw).charAt(0).toUpperCase() + kw.slice(1)} color='success' style={{margin: '0.2rem'}} />
                          ))}
                        </Box>
                        <hr></hr>
                      </Box>
                    ))}

                    {cv.skills.length !== 0 && <h2>Навыки</h2>}
                    {cv.skills.length !== 0 && cv.skills.map((sk: any, index: number) => (
                      <Box key={sk.name + index}>
                        {sk.name}
                      </Box>
                    ))}
                    {cv.skills.length !== 0 && <hr></hr>}


                    {cv.languages.length !== 0 && <h2>Языки</h2>}
                    {cv.languages.length !== 0 && cv.languages.map((lg: any, index: number) => (
                      <Box key={lg.name + index}>
                        {lg.name}
                      </Box>
                    ))}
                    {cv.languages.length !== 0 && <hr></hr>}

                    {cv.additional_data.length !== 0 && <h2>Дополнительая информация</h2>}
                    {cv.additional_data.length !== 0 && cv.additional_data.map((ad: any, index: number) => (
                      <Box key={ad.name + index}>
                        {ad.name} - {ad.value}
                      </Box>
                    ))}
                    {cv.additional_data.length !== 0 && <hr></hr>}


                    {(cv.contact_info.name !== 'N/A' || cv.contact_info.email !== 'N/A' || cv.contact_info.phone !== 'N/A') && <h2>Контактная информация</h2>}
                    
                    {cv.contact_info.name !== 'N/A' && <p>Имя: {cv.contact_info.name}</p>}
                    {cv.contact_info.email !== 'N/A' && <p>Email: {cv.contact_info.email}</p>}
                    {cv.contact_info.phone !== 'N/A' && <p>Телефон: {cv.contact_info.phone}</p>}
                    {(cv.contact_info.name !== 'N/A' || cv.contact_info.email !== 'N/A' || cv.contact_info.phone !== 'N/A') && <hr></hr>}
                </CardContent>
                <CardActions className='card-actions'>
                  <Link className='see-cv' href={cv.url} target="_blank" variant='button'>Посмотреть резюме</Link>
                </CardActions>
              </Card>
            ))
            )}
          </Box>
        </Box>
      </Container>
  );
};

export default App;
