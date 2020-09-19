package com.bulletjournal.templates.resourcefinder;

import com.bulletjournal.templates.repository.SelectionRepository;
import com.bulletjournal.templates.repository.model.SampleTask;
import com.bulletjournal.templates.repository.model.Selection;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LeetCodeAnalyzer {
    private final TestRestTemplate restTemplate = new TestRestTemplate();

    private static final String MATCHESSTRING = "href=\"/company/";
    private static final String MATCHESSTRING2 = "<span class=\"text-sm text-gray\">";

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Autowired
    private SelectionRepository selectionRepository;

    @Test
    public void testCompany() throws IOException {
        List<String> companyNames = readCompanyNamesFromLeetCode("./src/test/resources/leetcode-companies.html");
        File file = new File("./src/main/resources/db/migration/V84__replace_companies.sql");
        FileOutputStream fos = new FileOutputStream(file);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos));
        bw.write("delete from \"template\".selections where choice_id=13;\n");
        bw.newLine();
        for (String company : companyNames) {
            bw.write("INSERT INTO \"template\".selections (id,created_at,updated_at,icon,\"text\",choice_id) VALUES\n" +
                    "(nextval('template.selection_sequence'),'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593',null,'COMPANY_NAME',13);".replace("COMPANY_NAME", company));
            bw.newLine();
        }
        bw.close();

        List<Selection> selections = selectionRepository.getAllByChoiceId(13L);
        Assert.assertEquals(selections.size(), companyNames.size());
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
        BufferedWriter bufferedWriterSampleTask = getBufferedWriter("./src/main/resources/db/migration/V86__seed_sample_tasks.sql");
        BufferedWriter bufferedWriterSelection = getBufferedWriter("./src/main/resources/db/migration/V87__seed_algorithm_topic.sql");
        List<String> companies = readCompaniesFromLeetCode("./src/test/resources/leetcode-companies.html");
        //companies = companies.subList(0, 1);
        Map<String, List<String>> mapForContent = new HashMap<>();
        Set<String> algorithmTopics = new HashSet<>();
        Map<String, SampleTask> dataMap = getDataForCompany(companies, mapForContent, algorithmTopics);
        String contentTemplate = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"DIFFICULTY\"},DELTA_COMPANIES" +
                "{\"insert\":\"Link: \"},{\"attributes\":{\"link\":\"PROBLEM_LINK\"},\"insert\":\"PROBLEM_LINK\"}," +
                "{\"insert\":\"\\n\"}]},\"mdelta\":[{\"attributes\":{\"b\":true},\"insert\":\"DIFFICULTY\"},M_COMPANIES{\"insert\":\"Link: \"}," +
                "{\"attributes\":{\"a\":\"PROBLEM_LINK\"},\"insert\":\"PROBLEM_LINK\"},{\"insert\":\"\\n\"}]," +
                "\"###html###\":\"<p><strong>DIFFICULTY</strong></p><ul>HTML_COMPANIES</ul><p>Link: <a href=\\\"PROBLEM_LINK\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">PROBLEM_LINK</a></p>\"}";
        for (SampleTask sampleTask : dataMap.values()) {
            String difficulty = mapForContent.get(sampleTask.getUid()).get(0);
            List<String> coms = mapForContent.get(sampleTask.getUid()).subList(1, mapForContent.get(sampleTask.getUid()).size());
            String htmlCompanies = coms.stream().map(c -> "<li>" + c + "</li>").collect(Collectors.joining(""));
            String deltaCompanies = coms.stream().map(c -> "{\"insert\":\"\\n" + c + "\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},").collect(Collectors.joining(""));
            String mDeltaCompanies = coms.stream().map(c -> "{\"insert\":\"\\n" + c + "\"},{\"attributes\":{\"block\":\"ul\"},\"insert\":\"\\n\"},").collect(Collectors.joining(""));
            String content = contentTemplate.replace("PROBLEM_LINK", sampleTask.getContent()).replace("DIFFICULTY", difficulty).replace("HTML_COMPANIES", htmlCompanies).replace("DELTA_COMPANIES", deltaCompanies).replace("M_COMPANIES", mDeltaCompanies);
            sampleTask.setContent(content);
            bufferedWriterSampleTask.write("INSERT INTO \"template\".sample_tasks (id,created_at,updated_at,metadata,content,name,uid) VALUES (nextval('template.sample_task_sequence'),'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','S_T_METADATA','S_T_CONTENT','S_T_NAME','S_T_UID');".replace("S_T_METADATA", sampleTask.getMetadata()).replace("S_T_NAME", sampleTask.getName()).replace("S_T_UID", sampleTask.getUid()).replace("S_T_CONTENT", sampleTask.getContent()));
            bufferedWriterSampleTask.newLine();
        }
        bufferedWriterSelection.write("delete from \"template\".selections where choice_id=15;\n");
        for (String algorithmTopic : algorithmTopics) {
            bufferedWriterSelection.write("INSERT INTO \"template\".selections (id,created_at,updated_at,icon,\"text\",choice_id) VALUES (nextval('template.selection_sequence'),'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593',null,'ALGORITHM_TOPIC',15);".replace("ALGORITHM_TOPIC", algorithmTopic));
            bufferedWriterSelection.newLine();
        }
        bufferedWriterSampleTask.close();
        bufferedWriterSelection.close();
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
            requestHeaders.add("Cookie", "");
            requestHeaders.add("content-type", "application/json");
            String query = "{\"operationName\":\"getCompanyTag\",\"variables\":{\"slug\":\"*****\"},\"query\":\"query getCompanyTag($slug: String!) {\\n  companyTag(slug: $slug) {\\n    name\\n    translatedName\\n    frequencies\\n    questions {\\n      ...questionFields\\n      __typename\\n    }\\n    __typename\\n  }\\n  favoritesLists {\\n    publicFavorites {\\n      ...favoriteFields\\n      __typename\\n    }\\n    privateFavorites {\\n      ...favoriteFields\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment favoriteFields on FavoriteNode {\\n  idHash\\n  id\\n  name\\n  isPublicFavorite\\n  viewCount\\n  creator\\n  isWatched\\n  questions {\\n    questionId\\n    title\\n    titleSlug\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment questionFields on QuestionNode {\\n  status\\n  questionId\\n  questionFrontendId\\n  title\\n  titleSlug\\n  translatedTitle\\n  stats\\n  difficulty\\n  isPaidOnly\\n  topicTags {\\n    name\\n    translatedName\\n    slug\\n    __typename\\n  }\\n  frequencyTimePeriod\\n  __typename\\n}\\n\"}".replace("*****", company);
            LinkedHashMap dataMap = (LinkedHashMap) ((LinkedHashMap) requestLeetCode(requestHeaders, query).getBody().get("data")).get("companyTag");
            String companyName = dataMap.get("name").toString();
            List<LinkedHashMap> questions = (List) dataMap.get("questions");
            questions.forEach(question -> {
                String questionFrontendId = question.get("questionFrontendId").toString();
                if (!questionIdSampleTaskMap.containsKey(questionFrontendId)) {
                    SampleTask sampleTask = new SampleTask();
                    questionIdSampleTaskMap.put(questionFrontendId, sampleTask);
                    sampleTask.setUid(questionFrontendId);
                    sampleTask.setName(questionFrontendId + " " + question.get("title").toString().replace("'", "''"));
                    sampleTask.setContent("https://leetcode.com/problems/" + question.get("titleSlug") + "/");
                    List<LinkedHashMap> topics = (List<LinkedHashMap>) question.get("topicTags");
                    List<String> topicStrings = new ArrayList<>();
                    for (LinkedHashMap topic : topics) {
                        topicStrings.add(topic.get("name").toString());
                        algorithmTopics.add(topic.get("name").toString());
                    }
                    sampleTask.setMetadata(question.get("difficulty") + "," + String.join("|", topicStrings));
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
                    frequencyTimePeriodList.add("#");

                }
                questionIdCompanyMap.get(questionFrontendId).add(companyName + "frequencytimeperiod" + String.join("", frequencyTimePeriodList));
            });
            Thread.sleep(10000);
        }
        questionIdSampleTaskMap.forEach((questionId, sampleTask) -> {
            sampleTask.setMetadata("LEETCODE," + sampleTask.getMetadata() + "," + String.join("|", questionIdCompanyMap.get(questionId)));
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
