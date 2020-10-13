package com.bulletjournal.templates.resourcefinder;

import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.templates.controller.WorkflowController;
import com.bulletjournal.templates.repository.SampleTaskRuleRepository;
import com.bulletjournal.templates.repository.SelectionRepository;
import com.bulletjournal.templates.repository.StepRepository;
import com.bulletjournal.templates.repository.model.SampleTask;
import com.bulletjournal.templates.repository.model.SampleTaskRuleId;
import com.bulletjournal.templates.repository.model.Selection;
import com.bulletjournal.templates.repository.model.Step;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LeetCodeAnalyzer {
    private final TestRestTemplate restTemplate = new TestRestTemplate();
    private static final String USER = "BulletJournal"; // with admin role
    private static final String ROOT_URL = "http://localhost:";
    private static final String MATCHESSTRING = "href=\"/company/";
    private static final String MATCHESSTRING2 = "<span class=\"text-sm text-gray\">";
    private static final Gson GSON = new Gson();

    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Autowired
    private SelectionRepository selectionRepository;

    @Autowired
    private SampleTaskRuleRepository sampleTaskRuleRepository;

    @Autowired
    private StepRepository stepRepository;

    private static final Map<Integer, String> FREQUENCIES = ImmutableMap.of(
            261, "####",
            262, "###",
            263, "##",
            264, "#"
    );

    private List<com.bulletjournal.templates.controller.model.SampleTask> getAlgorithmSampleTasks() {
        String url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + WorkflowController.SAMPLE_TASK_BY_METADATA)
                .queryParam("filter", "LEETCODE_ALGORITHM")
                .toUriString();
        ResponseEntity<com.bulletjournal.templates.controller.model.SampleTask[]> response = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                com.bulletjournal.templates.controller.model.SampleTask[].class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<com.bulletjournal.templates.controller.model.SampleTask> l = Arrays.asList(response.getBody());
        return l;
    }

    @Test
    @Ignore
    public void linkTasksToSelection() {
        Step step = this.stepRepository.getById(11L);
        List<com.bulletjournal.templates.controller.model.SampleTask> l = getAlgorithmSampleTasks();
        // Difficulty
        Set<Long> set = new TreeSet<>();
        String[] difficulties = new String[]{"Easy", "Medium", "Hard"};
        for (int i = 0; i < difficulties.length; i++) {
            String difficulty = difficulties[i];
            set = new TreeSet<>(l.stream().filter(task -> task.getMetadata().split(",")[1].equals(difficulty))
                    .map(task -> task.getId())
                    .collect(Collectors.toSet()));
            String s1 = String.format("UPDATE template.sample_task_rules " + "SET task_ids = '%s' " +
                    "WHERE step_id = 11" +
                    " AND selection_combo = '%d';", set.toString().substring(1, set.toString().length() - 1), 11 + i * 2);
            System.out.println(s1);
        }

        // Topic
        List<Selection> selections = this.selectionRepository.findAll();
        for (long i = 1000L; i < 1040L; i++) {
            final long id = i;
            Optional<Selection> selectionOptional = selections.stream().filter(s -> s.getId().equals(id)).findFirst();
            if (!selectionOptional.isPresent()) {
                continue;
            }
            Selection selection = selectionOptional.get();
            set.clear();
            for (com.bulletjournal.templates.controller.model.SampleTask task : l) {
                if (task.getMetadata().split(",")[2].contains(selection.getText())) {
                    set.add(task.getId());
                }
            }
            String s = set.toString();
            s = s.substring(1, s.length() - 1);
            String s2 = String.format("UPDATE template.sample_task_rules " + "SET task_ids = '%s' " +
                    "WHERE step_id = 11" +
                    " AND selection_combo = '%d';", s, selection.getId());
            System.out.println(s2);
        }

        // Company
        // frequencytimeperiod#
        for (long i = 300L; i <= 537L; i++) {
            final long id = i;
            Optional<Selection> selectionOptional = selections.stream().filter(s -> s.getId().equals(id)).findFirst();
            if (!selectionOptional.isPresent()) {
                continue;
            }
            Selection selection = selectionOptional.get();
            for (int j = 261; j < 265; j++) {
                set.clear();
                for (com.bulletjournal.templates.controller.model.SampleTask task : l) {
                    if (task.getMetadata().split(",")[3]
                            .contains(selection.getText() + "frequencytimeperiod" + FREQUENCIES.get(j))) {
                        set.add(task.getId());
                    }
                }
                String s = set.toString();
                s = s.substring(1, s.length() - 1);
                String selectionCombo = j + "," + selection.getId();
                String s3 = String.format("UPDATE template.sample_task_rules " + "SET task_ids = '%s' " +
                        "WHERE step_id = 11" +
                        " AND selection_combo = '%s';", s, selectionCombo);
                SampleTaskRuleId sampleTaskRuleId = new SampleTaskRuleId(step, selectionCombo);
                if (!this.sampleTaskRuleRepository.existsById(sampleTaskRuleId)) {
                    s3 = String.format("INSERT INTO template.sample_task_rules (task_ids, step_id, selection_combo) " +
                            "VALUES ('%s', 11, '%s');", s, selectionCombo);
                }
                System.out.println(s3);
            }
        }
    }

    @Ignore
    @Test
    public void generateDb() throws IOException, InterruptedException {
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", "LEETCODE_SESSION=; Max-Age=31449600; Path=/; secure");
        requestHeaders.add("content-type", "application/json");
        HttpEntity requestEntity = new HttpEntity(requestHeaders);
        ResponseEntity<String> responseEntity = this.restTemplate.exchange(
                "https://leetcode.com/api/problems/database/",
                HttpMethod.GET, requestEntity, String.class);

        String result = responseEntity.getBody();

        BufferedWriter bufferedWriter = getBufferedWriter("./src/main/resources/db/migration/V118__seed_db_sample_tasks.sql");

        LinkedHashMap map = GSON.fromJson(result, LinkedHashMap.class);
        List<LinkedTreeMap> questions = (List) map.get("stat_status_pairs");
        String contentTemplate = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"DIFFICULTY\"}," +
                "{\"insert\":\"Link: \"},{\"attributes\":{\"link\":\"PROBLEM_LINK\"},\"insert\":\"PROBLEM_LINK\"}," +
                "{\"insert\":\"\\n\"}]}," +
                "\"###html###\":\"<p><strong>DIFFICULTY</strong></p><p>Link: <a href=\\\"PROBLEM_LINK\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">PROBLEM_LINK</a></p>\"}";
        for (LinkedTreeMap question : questions) {
            LinkedTreeMap questionData = (LinkedTreeMap) question.get("stat");
            double id = (double) questionData.get("frontend_question_id");
            String questionId = Integer.toString((int) id);
            String link = "https://leetcode.com/problems/" + questionData.get("question__title_slug") + "/";
            String questionName = questionId + " " + questionData.get("question__title");
            String metaData = "LEETCODE_DATABASE,";
            String difficulty = "";
            LinkedTreeMap diffLevel = (LinkedTreeMap) question.get("difficulty");
            double dif = (double) diffLevel.get("level");
            if (dif == 1.0) {
                difficulty = "Easy";
            } else if (dif == 2.0) {
                difficulty = "Medium";
            } else if (dif == 3.0) {
                difficulty = "Hard";
            }
            metaData += difficulty;
            String content = contentTemplate.replace("DIFFICULTY", difficulty).replace("PROBLEM_LINK", link);
            bufferedWriter.write("INSERT INTO \"template\".sample_tasks (id,created_at,updated_at,metadata,content,name,uid) VALUES (S_T_ID,'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','S_T_METADATA','S_T_CONTENT','S_T_NAME','S_T_UID');".replace("S_T_METADATA", metaData)
                    .replace("S_T_NAME", questionName)
                    .replace("S_T_UID", questionId)
                    .replace("S_T_ID", questionId)
                    .replace("S_T_CONTENT", content));
            bufferedWriter.newLine();

        }
        bufferedWriter.close();
        System.out.println();
    }

    @Test
    public void testCompany() throws IOException {
        List<String> companyNames = readCompanyNamesFromLeetCode("./src/test/resources/leetcode-companies.html");
        List<Selection> selections = selectionRepository.getAllByChoiceId(13L);
        Set<String> companyNameSet = new HashSet<>(companyNames);
        Set<String> intersection = new HashSet<>(companyNames);
        Set<String> selectionsSet = selections.stream().map(s -> s.getText()).collect(Collectors.toSet());
        intersection.retainAll(selectionsSet);
        companyNameSet.removeAll(intersection);
        selectionsSet.removeAll(intersection);
        System.out.println("new: " + companyNameSet);
        System.out.println("deleted: " + selectionsSet);
        selectionsSet.forEach(s -> {
            System.out.println(
                    selections.stream().filter(sel -> sel.getText().equals(s)).findFirst().get().getId());
        });
        Assert.assertEquals(selections.size(), companyNames.size());
    }

    private void testTopic(Set<String> algorithmTopics) {
        Set<String> intersection = new HashSet<>(algorithmTopics);
        List<Selection> selections = selectionRepository.getAllByChoiceId(15L);
        Set<String> selectionsSet = selections.stream().map(s -> s.getText()).collect(Collectors.toSet());
        intersection.retainAll(selectionsSet);
        algorithmTopics.removeAll(intersection);
        selectionsSet.removeAll(intersection);
        System.out.println("new: " + algorithmTopics);
        System.out.println("deleted: " + selectionsSet);
        selectionsSet.forEach(s -> {
            System.out.println(
                    selections.stream().filter(sel -> sel.getText().equals(s)).findFirst().get().getId());
        });
        if (selections.size() != algorithmTopics.size()) {
            System.err.println("Topic changed");
        }
    }

    private List<String> readCompanyNamesFromLeetCode(String file) throws IOException {
        List<String> companies = new ArrayList<>();
        FileReader fileReader = null;
        BufferedReader bufferedReader = null;
        try {
            fileReader = new FileReader(file);
            bufferedReader = new BufferedReader(fileReader);
            String line = bufferedReader.readLine();
            boolean flag = false;
            while (line != null) {
                if (flag) {
                    companies.add(line.trim());
                    flag = false;
                }
                int index = line.indexOf(MATCHESSTRING2);
                if (index != -1) {
                    flag = true;
                }
                line = bufferedReader.readLine();
            }
        } catch (IOException e) {
            if (fileReader != null) {
                fileReader.close();
            }
            if (bufferedReader != null) {
                bufferedReader.close();
            }
            e.printStackTrace();
        }
        return companies;
    }

    @Test
    @Ignore
    public void findDataFromLeetCode() throws IOException, InterruptedException {
        BufferedWriter bufferedWriterSampleTask = getBufferedWriter("./src/main/resources/db/migration/V131__seed_sample_tasks.sql");
        List<String> companies = readCompaniesFromLeetCode("./src/test/resources/leetcode-companies.html");
        //companies = companies.subList(0, 1);
        Map<String, List<String>> mapForContent = new HashMap<>();
        Set<String> algorithmTopics = new HashSet<>();
        Map<String, SampleTask> dataMap = getDataForCompany(companies, mapForContent, algorithmTopics);

        testTopic(algorithmTopics);

        String contentTemplate = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"DIFFICULTY\"},DELTA_COMPANIES" +
                "{\"insert\":\"Link: \"},{\"attributes\":{\"link\":\"PROBLEM_LINK\"},\"insert\":\"PROBLEM_LINK\"}," +
                "{\"insert\":\"\\n\"}]}," +
                "\"###html###\":\"<p><strong>DIFFICULTY</strong></p><ul>HTML_COMPANIES</ul><p>Link: <a href=\\\"PROBLEM_LINK\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">PROBLEM_LINK</a></p>\"}";

        List<com.bulletjournal.templates.controller.model.SampleTask> sampleTasksFromDb = getAlgorithmSampleTasks();
        for (com.bulletjournal.templates.controller.model.SampleTask sampleTaskFromDb : sampleTasksFromDb) {
            if (dataMap.containsKey(sampleTaskFromDb.getUid())) {
                SampleTask sampleTask = dataMap.get(sampleTaskFromDb.getUid());
                String difficulty = mapForContent.get(sampleTask.getUid()).get(0);
                List<String> coms = mapForContent.get(sampleTask.getUid()).subList(1, mapForContent.get(sampleTask.getUid()).size());
                String htmlCompanies = coms.stream().map(c -> "<li>" + c + "</li>").collect(Collectors.joining(""));
                String deltaCompanies = coms.stream().map(c -> "{\"insert\":\"\\n" + c + "\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},").collect(Collectors.joining(""));
                String mDeltaCompanies = coms.stream().map(c -> "{\"insert\":\"\\n" + c + "\"},{\"attributes\":{\"block\":\"ul\"},\"insert\":\"\\n\"},").collect(Collectors.joining(""));
                String content = contentTemplate.replace("PROBLEM_LINK", sampleTask.getContent()).replace("DIFFICULTY", difficulty).replace("HTML_COMPANIES", htmlCompanies).replace("DELTA_COMPANIES", deltaCompanies).replace("M_COMPANIES", mDeltaCompanies);
                sampleTask.setContent(content);
                bufferedWriterSampleTask.write("UPDATE \"template\".sample_tasks SET content='S_T_CONTENT', metadata='S_T_METADATA' WHERE id=S_T_ID;"
                        .replace("S_T_METADATA", sampleTask.getMetadata())
                        .replace("S_T_CONTENT", sampleTask.getContent())
                        .replace("S_T_ID", sampleTask.getUid()));
                bufferedWriterSampleTask.newLine();
                dataMap.remove(sampleTaskFromDb.getUid());
            }
        }

        for (SampleTask sampleTask : dataMap.values()) {
            String difficulty = mapForContent.get(sampleTask.getUid()).get(0);
            List<String> coms = mapForContent.get(sampleTask.getUid()).subList(1, mapForContent.get(sampleTask.getUid()).size());
            String htmlCompanies = coms.stream().map(c -> "<li>" + c + "</li>").collect(Collectors.joining(""));
            String deltaCompanies = coms.stream().map(c -> "{\"insert\":\"\\n" + c + "\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},").collect(Collectors.joining(""));
            String mDeltaCompanies = coms.stream().map(c -> "{\"insert\":\"\\n" + c + "\"},{\"attributes\":{\"block\":\"ul\"},\"insert\":\"\\n\"},").collect(Collectors.joining(""));
            String content = contentTemplate.replace("PROBLEM_LINK", sampleTask.getContent()).replace("DIFFICULTY", difficulty).replace("HTML_COMPANIES", htmlCompanies).replace("DELTA_COMPANIES", deltaCompanies).replace("M_COMPANIES", mDeltaCompanies);
            sampleTask.setContent(content);
            bufferedWriterSampleTask.write("INSERT INTO \"template\".sample_tasks (id,created_at,updated_at,metadata,content,name,uid,pending) VALUES (S_T_ID,'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','S_T_METADATA','S_T_CONTENT','S_T_NAME','S_T_UID',true);"
                    .replace("S_T_METADATA", sampleTask.getMetadata())
                    .replace("S_T_NAME", sampleTask.getName())
                    .replace("S_T_ID", sampleTask.getUid())
                    .replace("S_T_UID", sampleTask.getUid())
                    .replace("S_T_CONTENT", sampleTask.getContent()));
            bufferedWriterSampleTask.newLine();
        }
        bufferedWriterSampleTask.close();
        //bufferedWriterSelection.close();
        System.out.println("Finished");
    }

    private BufferedWriter getBufferedWriter(String path) throws FileNotFoundException {
        File file = new File(path);
        FileOutputStream fos = new FileOutputStream(file);
        return new BufferedWriter(new OutputStreamWriter(fos));
    }

    private ResponseEntity<LinkedHashMap> requestLeetCode(HttpHeaders requestHeaders, String query) {
        HttpEntity requestEntity = new HttpEntity(query, requestHeaders);
        return this.restTemplate.exchange(
                "https://leetcode.com/graphql",
                HttpMethod.POST, requestEntity, LinkedHashMap.class);
    }

    private Map<String, SampleTask> getDataForCompany(List<String> companies, Map<String, List<String>> mapForContent, Set<String> algorithmTopics) throws InterruptedException {
        Map<String, SampleTask> questionIdSampleTaskMap = new HashMap<>();
        Map<String, List<String>> questionIdCompanyMap = new HashMap<>();
        for (String company : companies) {
            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.add("Cookie", "LEETCODE_SESSION=; Max-Age=31449600; Path=/; secure");
            requestHeaders.add("content-type", "application/json");
            String query = "{\"operationName\":\"getCompanyTag\",\"variables\":{\"slug\":\"*****\"},\"query\":\"query getCompanyTag($slug: String!) {\\n  companyTag(slug: $slug) {\\n    name\\n    translatedName\\n    frequencies\\n    questions {\\n      ...questionFields\\n      __typename\\n    }\\n    __typename\\n  }\\n  favoritesLists {\\n    publicFavorites {\\n      ...favoriteFields\\n      __typename\\n    }\\n    privateFavorites {\\n      ...favoriteFields\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment favoriteFields on FavoriteNode {\\n  idHash\\n  id\\n  name\\n  isPublicFavorite\\n  viewCount\\n  creator\\n  isWatched\\n  questions {\\n    questionId\\n    title\\n    titleSlug\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment questionFields on QuestionNode {\\n  status\\n  questionId\\n  questionFrontendId\\n  title\\n  titleSlug\\n  translatedTitle\\n  stats\\n  difficulty\\n  isPaidOnly\\n  topicTags {\\n    name\\n    translatedName\\n    slug\\n    __typename\\n  }\\n  frequencyTimePeriod\\n  __typename\\n}\\n\"}".replace("*****", company);
            LinkedHashMap dataMap = (LinkedHashMap) ((LinkedHashMap) requestLeetCode(requestHeaders, query).getBody().get("data")).get("companyTag");
            String companyName = dataMap.get("name").toString();
            List<LinkedHashMap> questions = (List) dataMap.get("questions");
            questions.forEach(question -> {
                String questionFrontendId = question.get("questionFrontendId").toString();
                if (!questionIdSampleTaskMap.containsKey(questionFrontendId)) {
                    SampleTask sampleTask = new SampleTask();
                    sampleTask.setUid(questionFrontendId);
                    sampleTask.setName(questionFrontendId + " " + question.get("title").toString().replace("'", "''"));
                    sampleTask.setContent("https://leetcode.com/problems/" + question.get("titleSlug") + "/");
                    List<LinkedHashMap> topics = (List<LinkedHashMap>) question.get("topicTags");
                    List<String> topicStrings = new ArrayList<>();
                    for (LinkedHashMap topic : topics) {
                        topicStrings.add(topic.get("name").toString());
                        algorithmTopics.add(topic.get("name").toString());
                    }
                    if (!topicStrings.isEmpty()) {
                        sampleTask.setMetadata(question.get("difficulty") + "," + String.join("|", topicStrings));
                        questionIdSampleTaskMap.put(questionFrontendId, sampleTask);
                    }
                }
                if (!mapForContent.containsKey(questionFrontendId)) {
                    mapForContent.put(questionFrontendId, new ArrayList<>());
                    mapForContent.get(questionFrontendId).add(question.get("difficulty").toString());
                }
                questionIdCompanyMap.putIfAbsent(questionFrontendId, new ArrayList<>());
                List<String> frequencyTimePeriodList = new ArrayList<>();

                if ((int) question.get("frequencyTimePeriod") == 4) {
                    frequencyTimePeriodList.add("#");
                    mapForContent.get(questionFrontendId).add(companyName + " (All Time)");
                } else if ((int) question.get("frequencyTimePeriod") == 3) {
                    frequencyTimePeriodList.add("##");
                    mapForContent.get(questionFrontendId).add(companyName + " (2 years)");
                } else if ((int) question.get("frequencyTimePeriod") == 2) {
                    frequencyTimePeriodList.add("###");
                    mapForContent.get(questionFrontendId).add(companyName + " (1 year)");
                } else if ((int) question.get("frequencyTimePeriod") == 1) {
                    mapForContent.get(questionFrontendId).add(companyName + " (6 months)");
                    frequencyTimePeriodList.add("####");
                }
                questionIdCompanyMap.get(questionFrontendId).add(companyName + "frequencytimeperiod" + String.join("", frequencyTimePeriodList));
            });
            Thread.sleep(10000);
        }
        questionIdSampleTaskMap.forEach((questionId, sampleTask) -> {
            sampleTask.setMetadata("LEETCODE_ALGORITHM," + sampleTask.getMetadata() + "," + String.join("|", questionIdCompanyMap.get(questionId)));
        });
        return questionIdSampleTaskMap;
    }

    private List<String> readCompaniesFromLeetCode(String file) throws IOException {
        List<String> companies = new ArrayList<>();
        FileReader fileReader = null;
        BufferedReader bufferedReader = null;
        try {
            fileReader = new FileReader(file);
            bufferedReader = new BufferedReader(fileReader);
            String line = bufferedReader.readLine();
            while (line != null) {
                int index = line.indexOf(MATCHESSTRING);
                if (index != -1) {
                    int firstIndex = index + MATCHESSTRING.length();
                    int secondIndex = firstIndex + line.substring(firstIndex).indexOf("/");
                    companies.add(line.substring(firstIndex, secondIndex));
                }
                line = bufferedReader.readLine();
            }
        } catch (IOException e) {
            if (fileReader != null) {
                fileReader.close();
            }
            if (bufferedReader != null) {
                bufferedReader.close();
            }
            e.printStackTrace();
        }
        return companies;
    }
}
